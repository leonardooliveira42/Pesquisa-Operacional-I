/***************************************************************
 *
 *          FUNÇÕES PARA COLOCAR OS RESULTS NO MODAL
 *
 **************************************************************/
function ModalResults(vetorDeMatriz) {

    // Div dentro do modal: divResultsModal
    $('#divResultsModal').empty();
    for (var i = 0; i < vetorDeMatriz.length; i++) {
        var numLinhas = vetorDeMatriz[i].length, 
        numColunas = vetorDeMatriz[i][0].length;
        $('#divResultsModal').append('<div> <h3 class="text-center mb-10"> Quadro ' + (i + 1) + ' </h3>  <table class="table table-hover table-responsive-sm" id="Quadro' + i + '"> <tbody>');
        for (var j = 0; j < numLinhas; j++) {
            $('#Quadro' + i + '').append('<tr id="linha' + j + '-' + i + '">');
            for (var k = 0; k < numColunas; k++) {
                if (vetorDeMatriz[i][j][k] == undefined) {
                    $('#linha' + j + '-' + i + '').append('<td>  </td>');
                }
                else {
                    var calc = vetorDeMatriz[i][j][k];
                    var numero = calc + "";
                    var decimal = numero.indexOf(".");
                    if (decimal != -1) {
                        calc = calc.toFixed(4);
                        calc = parseFloat(calc);
                    }
                    if (j == 0) {
                        $('#linha' + j + '-' + i + '').append('<th> ' + calc + ' </th>');
                    }
                    else if (j == 2 && k == 2) {
                        $('#linha' + j + '-' + i + '').append('<td class="table-success"> ' + calc + ' </td>');
                    }
                    else
                        $('#linha' + j + '-' + i + '').append('<td> ' + calc + ' </td>');
                }
                //console.log(vetorDeMatriz[i][j][k]);
            }
            $('#Quadro' + i + '').append('</tr>');
        }
        $('#divResultsModal').append('</tbody> </table> </div>');
    }
}