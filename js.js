$(document).ready(function() {
  var teamNumber = getUrlParameter('team');
  var mySKU;
  var competingCurrently = true;
  var skillsCompetition = false;
  var accessRobotEvents = false;
  var appID = "?X-TBA-App-Id=1148:statuspage:0.1"

  if (teamNumber == undefined)
    teamNumber = "1148"

  $('#indexLinks').append('<a href=rankings.html?team=' + teamNumber + '>Rankings</a>');
  $('#rankingsLinks').append('<a href=index.html?team=' + teamNumber + '>Main Page</a>');


  //For title, gets team name
  $.ajax({
    url: 'http://www.thebluealliance.com/api/v2/team/frc' + teamNumber + appID,
    dataType: 'json',
    success: function(jd) {
      $('#title').append('<p>Team ' + teamNumber + ', ' + jd.name + '</p>');
    },
    async: false,
  });
  //Sets SKU of tournament to any current tournament, if we're not in one, display the last tournament
  $.ajax({
    url: 'http://www.thebluealliance.com/api/v2/team/frc' + teamNumber + '/events' + appID,
    dataType: 'json',
    success: function(jd) {
      if (jd.length == 0) {
      } else {
        for(i = 0; i < jd.length; i++) {
          if(new Date(jd[i].end_date)>new Date(Date.now()) && new Date(jd[i].start_date)<new Date(Date.now()))
            $('#status').append('<p>' + jd[i].name + '</p>');
            mySKU = jd[i].key;
            $('#sku').append(mySKU + ': <a href=http://www.robotevents.com/' + mySKU + '.html>RobotEvents</a>, <a href=http://vex.us.nallen.me/events/view/' + mySKU + '>VexDB</a>');

        }
        $('#status').append('<p>No Ongoing Tournament/Tournament Ended - Displaying Previous Results</p>');
      }
    },
    async: false,
  });
  $.ajax({
    url: 'http://www.thebluealliance.com/api/v2/event/' + mySKU + '/matches' + appID,
    dataType: 'json',
    success: function(jd) {
      /*
      jd.sort(function(a, b){
        return a.match_number - b.match_number;
      });
      */
      console.log("test");
      console.log(jd);
      $('#status').append(jd[0].red);
      for (i = 0; i < jd.length; i++) {
        if (jd[i].red.teams[0] == teamNumber || jd[i].red.teams[1] == teamNumber || jd[i].red.teams[2] == teamNumber || jd[i].blue.teams[0] == teamNumber || jd[i].blue.teams[1] == teamNumber || jd[i].blue.teams[2] == teamNumber) {
          if (jd[i].blue.score == -1) {
            $('#status').append('<i>Next Match:</i> ');
            $('#status').append(jd[i].comp_level+' ');
            $('#status').append(jd[i].match_number);
            if (jd[i].red.teams[0] == teamNumber || jd[i].red.teams[1] == teamNumber || jd[i].red.teams[2] == teamNumber) {
              $('#status').append(", Red");
            } else {
              $('#status').append(", Blue");
            }
            $('#status').append('<br><div style="color:red;">' + jd[i].red.teams[0] + ", " + jd[i].red.teams[1]);
            if (jd[i].red.teams[2] != "")
              $('#status').append(", " + jd.result[i].red.teams[2]);
            $('#status').append('</div><div style="color:blue;">' + jd[i].blue.teams[0] + ", " + jd[i].blue.teams[1]);
            if (jd[i].blue.teams[2] != "")
              $('#status').append(", " + jd[i].blue.teams[2]);
            $('#status').append('</div><hr>');
            break;
          }
        }
      }
      scoreshtml = '<table style="width:100%" border="1"><tr><th>Match</th><th>Red Alliance</th><th>Blue Alliance</th><th>Red Score</th><th>Blue Score</th><th>Outcome</th></tr>';
      var highScore = 0;
      var lowScore = 5000;
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].red.teams == teamNumber || jd[i].red.teams[1] == teamNumber || jd[i].red.teams[2] == teamNumber || jd[i].blue.teams[0] == teamNumber || jd[i].blue.teams[1] == teamNumber || jd[i].blue.teams[2] == teamNumber) {
          scoreshtml += ('<tr>');
          scoreshtml += ('<td>'+jd.comp_level+' '+jd[i].matchNumber + '</td>');
          r1 = jd[i].red.teams[0];
          r2 = jd[i].red.teams[1];
          r3 = jd[i].red.teams[2];
          b1 = jd[i].blue.teams[0];
          b2 = jd[i].blue.teams[1];
          b3 = jd[i].blue.teams[2];
          if (r1 == teamNumber)
            r1 = '<b style="font-weight:bolder;">' + r1 + '</b>';
          if (r2 == teamNumber)
            r2 = '<b style="font-weight:bolder;">' + r2 + '</b>';
          if (r3 == teamNumber)
            r3 = '<b style="font-weight:bolder;">' + r3 + '</b>';
          if (b1 == teamNumber)
            b1 = '<b style="font-weight:bolder;">' + b1 + '</b>';
          if (b2 == teamNumber)
            b2 = '<b style="font-weight:bolder;">' + b2 + '</b>';
          if (b3 == teamNumber)
            b3 = '<b style="font-weight:bolder;">' + b3 + '</b>';
          if (jd[i].red.teams[2] == undefined) scoreshtml += ('<td class="red">' + r1 + ", " + r2 + '</td>');
          else scoreshtml += ('<td class="red">' + r1 + ", " + r2 + ", " + r3 + '</td>');
          if (jd[i].blue.teams[2] == undefined) scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + '</td>');
          else scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + ", " + b3 + '</td>');
          scoreshtml += ('<td class="red">' + jd[i].red.score + '</td>');
          scoreshtml += ('<td class="blue">' + jd[i].blue.score + '</td>');
          if (jd[i].blue.score == -1)
            scoreshtml += ('<td>Unplayed</td>');
          else if ((jd[i].red.teams[0] == teamNumber) || (jd[i].red.teams[1] == teamNumber) || (jd[i].red.teams[2] == teamNumber)) {
            if (parseInt(jd[i].red.score) > highScore) {
              highScore = parseInt(jd[i].red.score)
            }
            if (parseInt(jd[i].red.score) < lowScore) {
              lowScore = parseInt(jd[i].red.score)
            }
            if (parseInt(jd[i].red.score) > parseInt(jd[i].blue.score)) {
              scoreshtml += ('<td class="victory">WIN</td>');
            } else {
              scoreshtml += ('<td class="yellow">LOSS</td>');
            }
          } else {
            if (parseInt(jd[i].blue.score) > highScore) {
              highScore = parseInt(jd[i].blue.score)
            }
            if (parseInt(jd[i].blue.score) < lowScore) {
              lowScore = parseInt(jd[i].blue.score)
            }
            if (parseInt(jd[i].blue.score) > parseInt(jd[i].red.score)) {
              scoreshtml += ('<td class="victory">WIN</td>');
            } else {
              scoreshtml += ('<td class="yellow">LOSS</td>');
            }
          }
          scoreshtml += ('</tr>');
        }
      }
      scoreshtml += '</table>';
      $('#scores').append(scoreshtml);
      if (lowScore != 5000)
        $('#highlowscore').append('<p>High Score: ' + highScore + ', Low Score: ' + lowScore + '</p>');
    },
    async: false,
  });
  //Handle rankings from robotevents
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/rankings/?format=csv&sku=' + mySKU + '&div=1',
    dataType: 'json',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      if (jd.length < 3) {} else {
        for (i = 0; i < 3; i++) {
          $('#' + (i + 1)).append('<td>' + jd[i].rank + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].teamnum + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].wp + '</td>');
          $('#' + (i + 1)).append('<td>' + jd[i].sp + '</td>');
        }
      }
    },
    async: false,
  });
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/rankings/?format=csv&sku=' + mySKU + '&div=1',
    dataType: 'json',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      if (jd.length == 0) {} else {
        for (i = 0; i < jd.length; i++) {
          if (jd[i].teamnum == teamNumber) {
            $('#us').append('<td><b>' + jd[i].rank + '</b></td>');
            $('#us').append('<td><b>' + jd[i].teamnum + '</b></td>');
            $('#us').append('<td><b>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</b></td>');
            $('#us').append('<td><b>' + jd[i].wp + '</b></td>');
            $('#us').append('<td><b>' + jd[i].sp + '</b></td>');
          }
        }
      }
    },
    async: false,
  });

  //Handle rankings - from robotevents
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/rankings/?format=csv&sku=' + mySKU + '&div=1',
    dataType: 'json',
    success: function(input) {
      scoreshtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>W-L-T</th><th>WP</th><th>SP</th></tr>';
      var jd = jQuery.parseJSON(CSV2JSON(input));
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].teamnum == teamNumber) {
          scoreshtml += ('<td class=yellow><b>' + jd[i].rank + '</b></td>');
          scoreshtml += ('<td class=yellow><b>' + jd[i].teamnum + '</b></td>');
          scoreshtml += ('<td class=yellow><b>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</b></td>');
          scoreshtml += ('<td class=yellow><b>' + jd[i].wp + '</b></td>');
          scoreshtml += ('<td class=yellow><b>' + jd[i].sp + '</b></td></tr>');
        } else {
          scoreshtml += ('<td>' + jd[i].rank + '</td>');
          scoreshtml += ('<td>' + jd[i].teamnum + '</td>');
          scoreshtml += ('<td>' + jd[i].wins + '-' + jd[i].losses + '-' + jd[i].ties + '</td>');
          scoreshtml += ('<td>' + jd[i].wp + '</td>');
          scoreshtml += ('<td>' + jd[i].sp + '</td></tr>');
        }
      }
      scoreshtml += '</table>';
      $('#rankings').append(scoreshtml);
    },
    async: false,
  });
  //handle robot skills - from RobotEvents
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/skills_robot/?format=csv&sku=' + mySKU + '&div=',
    dataType: 'json',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      roboSkillsHtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>Score</th><th>Attempts</th></tr>';
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].teamnum == teamNumber) {
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].rank + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].team + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].highscore + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].attempts + '</b></td></tr>');
        } else {
          roboSkillsHtml += ('<td>' + jd[i].rank + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].team + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].highscore + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].attempts + '</td></tr>');
        }
      }
      roboSkillsHtml += '</table>';
      $('#roboskills').append(roboSkillsHtml);
    },
    async: false,
  });

  //handle programming sills - from robotevents
  $.ajax({
    url: 'http://ajax.robotevents.com/tm/results/skills_programming/?format=csv&sku=' + mySKU + '&div=',
    dataType: 'json',
    success: function(input) {
      var jd = jQuery.parseJSON(CSV2JSON(input));
      roboSkillsHtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>Score</th><th>Attempts</th></tr>';
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].teamnum == teamNumber) {
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].rank + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].team + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].highscore + '</b></td>');
          roboSkillsHtml += ('<td class=yellow><b>' + jd[i].attempts + '</b></td></tr>');
        } else {
          roboSkillsHtml += ('<td>' + jd[i].rank + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].team + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].highscore + '</td>');
          roboSkillsHtml += ('<td>' + jd[i].attempts + '</td></tr>');
        }
      }
      roboSkillsHtml += '</table>';
      $('#progskills').append(roboSkillsHtml);
    },
    async: false,
  });
  //Robot skills high score - from vexdb
  $.ajax({
    url: 'http://api.vexdb.io/v1/get_skills?season_rank=true&rank=1&program=VRC&season=current&type=0',
    dataType: 'json',
    success: function(jd) {
      $('#robohighscore').append(jd.result[0].team + " (" + jd.result[0].attempts + " attempts): " + jd.result[0].score);
    },
    async: false,
  });

  //programming skills high score - from vexdb
  $.ajax({
    url: 'http://api.vexdb.io/v1/get_skills?season_rank=true&rank=1&program=VRC&season=current&type=1',
    dataType: 'json',
    success: function(jd) {
      $('#proghighscore').append(jd.result[0].team + " (" + jd.result[0].attempts + " attempts): " + jd.result[0].score);
    },
    async: false,
  });
  if (!skillsCompetition) {
    $.ajax({
      url: ('http://ajax.robotevents.com/tm/results/rankings/?format=csv&sku=' + mySKU + '&div=1'),
      dataType: 'json',
      success: function(input) {
        var jd = jQuery.parseJSON(CSV2JSON(input));
        currentMatchNumber = 0;
        differience = 0;
        for (i = 0; i < jd.length; i++) {
          if (jd[i].scored == 'False') {
            currentMatchNumber = jd[i].matchnum;
            $('#currentmatch').append('Current Match Number: ' + jd[i].matchnum);
            break;
          }
        }
        /*
        for(i = 0; i<jd.length; i++) {
          if(jd[i].scored == 'False' && (jd[i].red1 == teamNumber || jd[i].red2 == teamNumber || jd[i].red3 == teamNumber || jd[i].blue1 == teamNumber || jd[i].blue2 == teamNumber || jd[i].blue3 == teamNumber)) {
            differience = jd[i].matchnum - currentMatchNumber;
            $('#currentmatch').append(', Our Next Match: ' + jd[i].matchnum + ', Up in <b>' + differience + '</b> matches');
            break;
          }
        }
        */
      },
      async: false,
    });
  }
});

function CSVToArray(strData, strDelimiter) {
  // Check to see if the delimiter is defined. If not,
  // then default to comma.
  strDelimiter = (strDelimiter || ",");
  // Create a regular expression to parse the CSV values.
  var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
  // Create an array to hold our data. Give the array
  // a default empty first row.
  var arrData = [
    []
  ];
  // Create an array to hold our individual pattern
  // matching groups.
  var arrMatches = null;
  // Keep looping over the regular expression matches
  // until we can no longer find a match.
  while (arrMatches = objPattern.exec(strData)) {
    // Get the delimiter that was found.
    var strMatchedDelimiter = arrMatches[1];
    // Check to see if the given delimiter has a length
    // (is not the start of string) and if it matches
    // field delimiter. If id does not, then we know
    // that this delimiter is a row delimiter.
    if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
      // Since we have reached a new row of data,
      // add an empty row to our data array.
      arrData.push([]);
    }
    // Now that we have our delimiter out of the way,
    // let's check to see which kind of value we
    // captured (quoted or unquoted).
    if (arrMatches[2]) {
      // We found a quoted value. When we capture
      // this value, unescape any double quotes.
      var strMatchedValue = arrMatches[2].replace(
        new RegExp("\"\"", "g"), "\"");
    } else {
      // We found a non-quoted value.
      var strMatchedValue = arrMatches[3];
    }
    // Now that we have our value string, let's add
    // it to the data array.
    arrData[arrData.length - 1].push(strMatchedValue);
  }
  // Return the parsed data.
  return (arrData);
}

function CSV2JSON(csv) {
  if(csv==undefined || csv=="")
    return "";
  var array = CSVToArray(csv);
  var objArray = [];
  for (var i = 1; i < array.length; i++) {
    objArray[i - 1] = {};
    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
      var key = array[0][k];
      objArray[i - 1][key] = array[i][k]
    }
  }

  var json = JSON.stringify(objArray);
  var str = json.replace(/},/g, "},\r\n");

  return str;
}

var getUrlParameter = function getUrlParameter(sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1)),
    sURLVariables = sPageURL.split('&'),
    sParameterName,
    i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};
