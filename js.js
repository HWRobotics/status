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
        jd.sort(function(a, b){
          return a.end_date - b.end_date;
        });
        $('#status').append('<p>' + jd[0].name + '</p>');
        mySKU = jd[0].key;
        $('#sku').append(mySKU + ': <a href=http://www.thebluealliance.com/event/' + mySKU+'>TBA</a>, <a href=http://frc-events.firstinspires.org/' + mySKU.substring(0,4) + '/' + mySKU.substring(4) + '>First</a>');
      }
    },
    async: false,
  });
  $.ajax({
    url: 'http://www.thebluealliance.com/api/v2/event/' + mySKU + '/matches' + appID,
    dataType: 'json',
    success: function(jd) {
      jd.sort(function(a, b){
        return a.match_number - b.match_number;
      });
      for (i = 0; i < jd.length; i++) {
        if (jd[i].alliances.red.teams[0] == 'frc'+teamNumber || jd[i].alliances.red.teams[1] == 'frc'+teamNumber || jd[i].alliances.red.teams[2] == 'frc'+teamNumber || jd[i].alliances.blue.teams[0] == 'frc'+teamNumber || jd[i].alliances.blue.teams[1] == 'frc'+teamNumber || jd[i].alliances.blue.teams[2] == 'frc'+teamNumber) {
          if (jd[i].alliances.blue.score == -1) {
            $('#status').append('<i>Next Match:</i> ');
            $('#status').append(jd[i].comp_level+' ');
            $('#status').append(jd[i].match_number);
            if (jd[i].alliances.red.teams[0] == 'frc'+teamNumber || jd[i].alliances.red.teams[1] == 'frc'+teamNumber || jd[i].alliances.red.teams[2] == 'frc'+teamNumber) {
              $('#status').append(", Red");
            } else {
              $('#status').append(", Blue");
            }
            $('#status').append('<br><div style="color:red;">' + jd[i].alliances.red.teams[0].substring(3) + ", " + jd[i].alliances.red.teams[1].substring(3));
            if (jd[i].alliances.red.teams[2] != "")
              $('#status').append(", " + jd[i].alliances.red.teams[2].substring(3));
            $('#status').append('</div><div style="color:blue;">' + jd[i].alliances.blue.teams[0].substring(3) + ", " + jd[i].alliances.blue.teams[1].substring(3));
            if (jd[i].alliances.blue.teams[2] != "")
              $('#status').append(", " + jd[i].alliances.blue.teams[2].substring(3));
            $('#status').append('</div><hr>');
            break;
          }
        }
      }
      scoreshtml = '<table style="width:100%" border="1"><tr><th>Match</th><th>Red Alliance</th><th>Blue Alliance</th><th>Red Score</th><th>Blue Score</th><th>Outcome</th></tr>';
      var highScore = 0;
      var lowScore = 5000;
      for (i = 0; i < jd.length - 1; i++) {
        if (jd[i].alliances.red.teams[0] == 'frc'+teamNumber || jd[i].alliances.red.teams[1] == 'frc'+teamNumber || jd[i].alliances.red.teams[2] == 'frc'+teamNumber || jd[i].alliances.blue.teams[0] == 'frc'+teamNumber || jd[i].alliances.blue.teams[1] == 'frc'+teamNumber || jd[i].alliances.blue.teams[2] == 'frc'+teamNumber) {
          scoreshtml += ('<tr>');
          scoreshtml += ('<td>'+jd[i].comp_level+' '+jd[i].match_number + '</td>');
          r1 = jd[i].alliances.red.teams[0].substring(3);
          r2 = jd[i].alliances.red.teams[1].substring(3);
          r3 = jd[i].alliances.red.teams[2].substring(3);
          b1 = jd[i].alliances.blue.teams[0].substring(3);
          b2 = jd[i].alliances.blue.teams[1].substring(3);
          b3 = jd[i].alliances.blue.teams[2].substring(3);
          if (r1 == 'frc'+teamNumber)
            r1 = '<b style="font-weight:bolder;">' + r1 + '</b>';
          if (r2 == 'frc'+teamNumber)
            r2 = '<b style="font-weight:bolder;">' + r2 + '</b>';
          if (r3 == 'frc'+teamNumber)
            r3 = '<b style="font-weight:bolder;">' + r3 + '</b>';
          if (b1 == 'frc'+teamNumber)
            b1 = '<b style="font-weight:bolder;">' + b1 + '</b>';
          if (b2 == 'frc'+teamNumber)
            b2 = '<b style="font-weight:bolder;">' + b2 + '</b>';
          if (b3 == 'frc'+teamNumber)
            b3 = '<b style="font-weight:bolder;">' + b3 + '</b>';
          if (jd[i].alliances.red.teams[2] == undefined) scoreshtml += ('<td class="red">' + r1 + ", " + r2 + '</td>');
          else scoreshtml += ('<td class="red">' + r1 + ", " + r2 + ", " + r3 + '</td>');
          if (jd[i].alliances.blue.teams[2] == undefined) scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + '</td>');
          else scoreshtml += ('<td class="blue">' + b1 + ", " + b2 + ", " + b3 + '</td>');
          scoreshtml += ('<td class="red">' + jd[i].alliances.red.score + '</td>');
          scoreshtml += ('<td class="blue">' + jd[i].alliances.blue.score + '</td>');
          if (jd[i].alliances.blue.score == -1)
            scoreshtml += ('<td>Unplayed</td>');
          else if ((jd[i].alliances.red.teams[0] == 'frc'+teamNumber) || (jd[i].alliances.red.teams[1] == 'frc'+teamNumber) || (jd[i].alliances.red.teams[2] == 'frc'+teamNumber)) {
            if (parseInt(jd[i].alliances.red.score) > highScore) {
              highScore = parseInt(jd[i].alliances.red.score)
            }
            if (parseInt(jd[i].alliances.red.score) < lowScore) {
              lowScore = parseInt(jd[i].alliances.red.score)
            }
            if (parseInt(jd[i].alliances.red.score) > parseInt(jd[i].alliances.blue.score)) {
              scoreshtml += ('<td class="victory">WIN</td>');
            } else {
              scoreshtml += ('<td class="yellow">LOSS</td>');
            }
          } else {
            if (parseInt(jd[i].alliances.blue.score) > highScore) {
              highScore = parseInt(jd[i].alliances.blue.score)
            }
            if (parseInt(jd[i].alliances.blue.score) < lowScore) {
              lowScore = parseInt(jd[i].alliances.blue.score)
            }
            if (parseInt(jd[i].alliances.blue.score) > parseInt(jd[i].alliances.red.score)) {
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
    url: 'http://www.thebluealliance.com/api/v2/event/' + mySKU + '/rankings' + appID,
    dataType: 'json',
    success: function(jd) {
      if (jd.length < 3) {} else {
        for (i = 1; i < 4; i++) {
          $('#' + (i)).append('<td>' + jd[i][0] + '</td>');
          $('#' + (i)).append('<td>' + jd[i][1] + '</td>');
          $('#' + (i)).append('<td>' + jd[i][7] + '</td>');
          $('#' + (i)).append('<td>' + jd[i][2] + '</td>');
          $('#' + (i)).append('<td>' + jd[i][8] + '</td>');
        }
      }
    },
    async: false,
  });
  $.ajax({
    url: 'http://www.thebluealliance.com/api/v2/event/' + mySKU + '/rankings' + appID,
    dataType: 'json',
    success: function(jd) {
      if (jd.length == 0) {} else {
        for (i = 1; i < jd.length; i++) {
          if (jd[i][1] == teamNumber) {
            $('#us').append('<td><b>' + jd[i][0] + '</b></td>');
            $('#us').append('<td><b>' + jd[i][1] + '</b></td>');
            $('#us').append('<td><b>' + jd[i][7] + '</b></td>');
            $('#us').append('<td><b>' + jd[i][2] + '</b></td>');
            $('#us').append('<td><b>' + jd[i][8] + '</b></td>');
          }
        }
      }
    },
    async: false,
  });

  //Handle rankings - from robotevents
  $.ajax({
    url: 'http://www.thebluealliance.com/api/v2/event/' + mySKU + '/rankings' + appID,
    dataType: 'json',
    success: function(jd) {
      scoreshtml = '<table style="width:100%" border="1"><tr><th>Rank</th><th>Team #</th><th>W-L-T</th><th>Ranking Points</th><th>Played</th></tr>';
      for (i = 1; i < jd.length - 1; i++) {
        if (jd[i][1] == teamNumber) {
          scoreshtml += ('<td class=yellow><b>' + jd[i][0] + '</b></td>');
          scoreshtml += ('<td class=yellow><b>' + jd[i][1] + '</b></td>');
          scoreshtml += ('<td class=yellow><b>' + jd[i][7] + '</b></td>');
          scoreshtml += ('<td class=yellow><b>' + jd[i][2] + '</b></td>');
          scoreshtml += ('<td class=yellow><b>' + jd[i][8] + '</b></td></tr>');
        } else {
          scoreshtml += ('<td>' + jd[i][0] + '</td>');
          scoreshtml += ('<td>' + jd[i][1] + '</td>');
          scoreshtml += ('<td>' + jd[i][7] + '</td>');
          scoreshtml += ('<td>' + jd[i][2] + '</td>');
          scoreshtml += ('<td>' + jd[i][8] + '</td></tr>');
        }
      }
      scoreshtml += '</table>';
      $('#rankings').append(scoreshtml);
    },
    async: false,
  });
});

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
