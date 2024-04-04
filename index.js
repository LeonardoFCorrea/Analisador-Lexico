var token = [];
var valuesGlobal = 0;
var valueInteration = [0];
var table = [];
var valores = [[]];

$(document).ready(function(){
  montarTabela();
  $('#validarToken').keyup(function(e){
    if(table.length > 0){ validarToken(e); }
  });
});

//funçao de montar a tabela
function montarTabela(){
  //zera os valores para montar novamente
  valores = [[]];
  valuesGlobal = 0;
  valueInteration = [0];
  table = [];
  montarEstados();
  table = gerarLinhasTabela();
  gerarTable(table);
}

function tokenAleatorio(){
  var chars = "abcdefghiklmnopqrstuvwxyz";
  var string_length = Math.floor((Math.random() * 10) + 5);
  var randomstring = '';
  for (var i=0; i<string_length; i++) {
    var rnum = Math.floor(Math.random() * chars.length);
    randomstring += chars.substring(rnum,rnum+1);
  }
  $('#token').val(randomstring);
}

function limparAnalisador (e) {
  $('#token').val("");
  $('#validarToken').val("");
  $('#validarToken').removeClass('certo');
  $('#validarToken').removeClass('errado');
  token = [];
  $('#listaTokens').empty();
  $('#tabela').empty();
  montarTabela();
}

function adicionarToken() {
  var value = $("#token").val().toLowerCase();
  if(value === ""){
    $('#token').addClass('errado');
    setTimeout(function(){
      $('#token').removeClass('errado');
    }, 2000);
  } else {
    var addNext = true;
      //verifica se no token a ser adicionado tem algum caractere que nao seja de 'a' a 'z'
      for (var i = 0; i < value.length; i++) {
        if(!((value[i] >= 'a' && value[i] <= 'z') || value[i] === ' ')){
          alert('Caractere inválido ' + value[i]);
          addNext = false;
          break;
        }
      }
      //somente letras (a-z)
      if (addNext) {
        //quebra a string em dois token
        value = value.split(" ");
        var number = token.length;
        //add varios token
        if(value.length > 1){
          for (i = 0; i < value.length; i++) {
            var exists = false;
            number = token.length;
            if(value[i] !== ""){
              //valida o token se nao é vazio ou se ja existe
              for (j = 0; j < token.length; j++) {
                if(value[i] === token[j]){
                  exists = true;
                }
              }
            }
          }
        } else {
          var exists = false;
          //verifica se o proximo token nao existe no dicionario
          for (j = 0; j < token.length; j++) {
            if(value[0] === token[j]){
              exists = true;
            }
          }
          //se nao existir no dicionario e adicionado
          if(!exists){
            $('#listaTokens').append($('<td class="list-group-item" id="word' + number + '">' + value[0] +
            ' </td>'));
            token.push(value[0]);
          }
        }
        //limpa o campo de token
        $("#token").val("");
      }
    }
    $('#tabela').empty();
    $('#validarToken').val("");
    $('#validarToken').removeClass('certo');
    $('#validarToken').removeClass('errado');
    montarTabela();
}

function gerarTable(vectorvalues){
  var tableFront = $('#tabela');
  tableFront.html('');
  var tr = $(document.createElement('tr'));
  var th = $(document.createElement('th'));
  th.html('');
  tr.append(th);
  var first = 'a';
  var last = 'z';
  for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
    var th = $( document.createElement('th') );
    th.html(String.fromCharCode(j));
    tr.append(th);
  }
  tableFront.append(tr);
  
  for(var i = 0; i < vectorvalues.length; i++){
    var tr = $(document.createElement('tr'));
    var td = $(document.createElement('td'));
    if(vectorvalues[i]['final']){
      td.html('q' + vectorvalues[i]['estado'] + '*');
    } else {
      td.html('q' + vectorvalues[i]['estado']);
    }
    tr.append(td);
    tr.addClass('state_'+vectorvalues[i]['estado']);
    var first = 'a';
    var last = 'z';
    for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
      var letter = String.fromCharCode(j);
      var td = $( document.createElement('td') );
      td.addClass('letter_'+letter);
      if(vectorvalues[i][letter] != '-'){
        td.html('q' + vectorvalues[i][letter]);
      } else {
        td.html('-');
      }
      tr.append(td);
    }
    tableFront.append(tr);
  }
}

function gerarLinhasTabela(){
  var vectorvalues = [];
  for (var i = 0; i < valores.length; i++) {
    var aux = [];
    aux['estado'] = i;
    var first = 'a';
    var last = 'z';
    for (var j = first.charCodeAt(0); j <= last.charCodeAt(0); j++) {
      var letter = String.fromCharCode(j);
      if(typeof valores[i][letter] === 'undefined'){
        aux[letter] = '-'
      } else {
        aux[letter] = valores[i][letter]
      }
    }
    if(typeof valores[i]['final'] !== 'undefined'){
      aux['final'] = true;
    }
    vectorvalues.push(aux);
  };
  return vectorvalues;
}

function montarEstados(){
  //itera sobre todos os token do dicionario
  for (var i = 0; i < token.length; i++) {
    var actualState = 0;
    var word = token[i];
    //itera sobre os caracteres do token
    for(var j = 0; j < word.length; j++){
      if(typeof valores[actualState][word[j]] === 'undefined'){
        var nextState = valuesGlobal + 1;
        valores[actualState][word[j]] = nextState;
        valores[nextState] = [];
        valuesGlobal = actualState = nextState;
      } else {
        actualState = valores[actualState][word[j]];
      }
      if(j == word.length - 1){
        valores[actualState]['final'] = true;
      }
    }
  }
}


