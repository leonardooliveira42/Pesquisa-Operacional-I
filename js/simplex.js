    
    //VARIAVEIS GLOBAIS 
    var numeroVariaveis = 0; 
    var numeroRestricoes = 0; 
    var tipoDeProblema = 0; 

    //Variaveis uteis
    var numeroTotalLinhas = 0; 
    var numeroTotalColunas = 0; 

    //Um array de matrizes 
    var ArrayQuadros = new Array(); 
    var contQuadros = 0; 

    $(document).ready(function(){
        ZeMariaAparecida(); 
        //ExemploIlimitado();
    });

    //Criando a matriz 
    var matriz = new Array(); 

    //Esconder a div com a seleção da quantidade de variaveis e restrições e deixa visivel 
    //A div com as inputs de leitura do problema de otimização
    function TrocarTela(){
        tipoDeProblema = LerValorId('tipoOtimizacao');
        numeroVariaveis = LerValorId('numVariaveis'); 
        numeroRestricoes = LerValorId('numRestricoes'); 
        var auxiliar = 'nada'; 

        console.log("Tipo: " + tipoDeProblema);

        if(numeroVariaveis == 0 || numeroRestricoes == 0){
            document.getElementById('alertaVazio').style.display = 'block';
        }else{
            document.getElementById('iniciarProblema').style.display = 'none';
            document.getElementById('tabelaDoProblema').style.display = 'block';

            switch(tipoDeProblema){
                case '1': 
                    auxiliar = "Maximizar "
                    break;
                case '2':
                    auxiliar = "Minimizar "
                    break;
            }

            $('#maxmin').replaceWith(auxiliar);

            //Criar a função objetivo 
            FuncaoObjetivo();
            FormRestricao(); 
            //Criar matriz 
        }
    }

    /****************************************************************
     * 
     *                          FORMA PADRÃO
     * 
     ***************************************************************/

    //Lê os dados das inputs e coloca em uma matriz 
    function FormParaMatriz(){
        var fObj = new Array(); 

        //Lendo 
        for(var i=0; i<numeroVariaveis; i++){
            if(LerValorId('x'+i) == '')
                fObj[i] = 0;
            else fObj[i] = LerValorId('x'+i);
        }

        //console.log(fObj);

        for(var i=0; i<numeroRestricoes; i++){
            matriz[i] = new Array(); 
            for(var j=0; j<numeroVariaveis; j++){
                var aux = LerValorId('a'+i+'-'+j+'');
                if(aux == ""){
                    aux = 0; 
                }                    
                else aux = parseInt(aux);

                matriz[i][j] = aux;

                //Alterando a ultima coluna da matriz 
                if(j == numeroVariaveis-1){
                    //Adicionando o tipo de inequação nos dados da matriz
                    matriz[i][j+1] = parseInt(LerValorId('ine'+i));

                    //Lendo os valores de b e colocando na matriz
                    aux = LerValorId('b'+i);
                    if(aux == ""){
                        aux = 0; 
                    }else aux = parseInt(aux);
                    
                    matriz[i][j+2] = aux; 
                }
            }
        }

        //console.log(matriz);

        matriz[numeroRestricoes] = new Array(); 

        for(var i=0; i<numeroVariaveis;i++){
            var aux = fObj[i]; 
            if(aux == '')
                aux = 0; 
            else aux = parseInt(aux); 
            matriz[numeroRestricoes][i] = aux;
        }
        //console.log(matriz);
        //Passar para forma padrão 
        FormaPadrao(matriz);
    }

    //Função para transformar a matriz lida em uma matriz na forma padrão 
    function FormaPadrao(MatrizLida){

        //Zerando o vetor de resultados
        ArrayQuadros = []; 
        contQuadros = 0; 

        var posVetorB = numeroVariaveis + 1; 
        var posIneq = numeroVariaveis; 

        numeroTotalLinhas = numeroRestricoes+2;

        //Criando uma matriz auxiliar 
        var MatrizAuxiliar = CriandoMatriz(numeroTotalLinhas);

        //Fazer as verificações do vetor b
        VerificarVetorB(MatrizLida,numeroRestricoes+1,numeroVariaveis+1);

        //Calculando o total maximo de colunas
        numeroTotalColunas = MaximoColunas(MatrizLida,posIneq,numeroVariaveis+2);         

        //Transição da matriz lida para a matrizPadrao
        var quantArtificias = TransicaoLidaPadrao(MatrizLida,MatrizAuxiliar,numeroTotalColunas-1,posIneq,posVetorB); 

        //Colocando a linha da função objetivo 
        AdicionandoAFuncObje(MatrizLida,MatrizAuxiliar,numeroTotalColunas-1);

        if(quantArtificias > 0){
            //Adicionando a linha w no quadro simplex
            AdicionandoLinhaW(MatrizAuxiliar,numeroTotalColunas-1);
            numeroTotalLinhas++;
            console.log(CopiarMatriz(MatrizAuxiliar,numeroTotalLinhas,numeroTotalColunas));
            ArrayQuadros[contQuadros++] = CopiarMatriz(MatrizAuxiliar,numeroTotalLinhas,numeroTotalColunas);
            //Resolvendo a primeira fase:

            //Remover linha W e colunas e linhas artificiais

            //Chama simplex
            Simplex(MatrizAuxiliar,numeroTotalColunas);

            console.log(MatrizAuxiliar);
            //Mostrando o resultado
            ModalResults(ArrayQuadros,numeroTotalLinhas,numeroTotalColunas);
            $('#ModalResults').modal('show'); 

        }else{
            ArrayQuadros[contQuadros++] = CopiarMatriz(MatrizAuxiliar,numeroTotalLinhas,numeroTotalColunas);
            //Chamando o simplex quando não existe variavel artificial
            Simplex(MatrizAuxiliar,numeroTotalColunas);

            console.log(MatrizAuxiliar);
            //Mostrando o resultado
            ModalResults(ArrayQuadros,numeroTotalLinhas,numeroTotalColunas);
            $('#ModalResults').modal('show'); 

            //Adiciona um botão de mostrar resultado
        }
    }

    // Função para gerar uma matriz com um determinado numero de linhas
    function CriandoMatriz(numeroLinhas){
        var criandoMatriz = new Array(numeroLinhas);
        for(var i=0; i<numeroLinhas;i++){
            criandoMatriz[i] = new Array(); 
        } 
        return criandoMatriz; 
    }

    // 
    function VerificarVetorB(matriz, numLinhas, vetorB){
        for(var i=0; i<numLinhas; i++){
            if(matriz[i][vetorB] < 0){
                //Fazer alteração necessaria do vetor b
                MultiplicaLinha(matriz,i,-1); 
            }
        }   
    }

    //
    function MaximoColunas(matriz, ineq, valorinicial){
        var numeroColunasPadrao = valorinicial;
        for(var i=0; i<numeroRestricoes;i++){
            switch(matriz[i][ineq]){
                case 1: 
                case 0: 
                    numeroColunasPadrao++; 
                    break; 
                case -1: 
                    numeroColunasPadrao += 2;
                    break;
            }
        }
        return numeroColunasPadrao;   
    }

    //
    function AdicionandoAFuncObje(matrizInicial, matrizFinal, colunas){

        matrizFinal[numeroRestricoes+1][0] = 'Z'; 

        for(var i=0; i<colunas; i++){
            if(matrizInicial[numeroRestricoes][i] == undefined){
                matrizFinal[numeroRestricoes+1][i+1] = 0;
            }else {
                var aux; 
                if(tipoDeProblema == 1){
                    aux = -1; 
                }else aux = 1; 
                matrizFinal[numeroRestricoes+1][i+1] = matrizInicial[numeroRestricoes][i] * aux;
            }
        }
    }

    //
    function AdicionandoLinhaW(matrizP, colunas){
        matrizP[numeroRestricoes+2] = new Array(); 
        matrizP[numeroRestricoes+2][0] = 'W';
        //Adicionando a linha w a matriz
        for(var i=1; i<colunas; i++){
            var valorColuna = 0; 
            for(var j=1;j<=numeroRestricoes;j++){
                var aux = matrizP[j][0].split("-");
                if(aux[0] == 'a'){  //é uma linha artificial 
                   valorColuna += matrizP[j][i];
                }
            }
            matrizP[numeroRestricoes+2][i] = valorColuna * (-1);
        }
        matrizP[numeroRestricoes+2][colunas] = 0; 
    }

    //
    function TransicaoLidaPadrao(matrizL,matrizP,colunas,ineq,vetorb){
        var quantArtificias = 0; 
        for(var i=0; i<numeroRestricoes; i++){
            for(var j=0; j<numeroVariaveis; j++){
                //Escreve o indice na primeira linha da matriz
                matrizP[0][j+1] = 'x'+j;
                //Copia os dados da matriz lida para a matriz padrao
                matrizP[i+1][j+1] = matrizL[i][j];
                //Se a copia atingiu o limite o algoritmo executa isso:
                if(j == numeroVariaveis-1){
                    for(var k=0; k<colunas-numeroVariaveis; k++){
                        //Aqui vai preencher as outras colunas do quadro simplex
                        if(k-quantArtificias == i){
                            switch(matrizL[i][ineq]){
                                //Caso a inequação for <= somente adiciona uma folga
                                case 1: 
                                    matrizP[i+1][k+1+numeroVariaveis] = 1; 
                                    matrizP[0][k+1+numeroVariaveis] = 'f-'+i; 
                                    matrizP[i+1][0] = 'f-'+i;
                                    break; 
                                //caso seja uma igualdade, só será adicionado uma artificial 
                                case 0: 
                                    matrizP[i+1][k+1+numeroVariaveis] = 1; 
                                    matrizP[0][k+1+numeroVariaveis] = 'a-'+i; 
                                    matrizP[i+1][0] = 'a-'+i;
                                    break; 
                                //caso seja maior ou igual, será adicionado uma folga negativa e uma artificial 
                                case -1: 
                                    matrizP[i+1][k+1+numeroVariaveis] = -1; 
                                    matrizP[0][k+1+numeroVariaveis] = 'f-'+i;  
                                    k++;
                                    matrizP[i+1][k+1+numeroVariaveis] = 1; 
                                    matrizP[0][k+1+numeroVariaveis] = 'a-'+i; 
                                    matrizP[i+1][0] = 'a-'+i;
                                    quantArtificias++;
                                    break; 
                            }
                        }else{
                            if(k == colunas-numeroVariaveis-1){
                                matrizP[i+1][k+1+numeroVariaveis] = matrizL[i][vetorb];
                            }else matrizP[i+1][k+1+numeroVariaveis] = 0; 
                        }
                    }
                }
            }
        }
        return quantArtificias;
    }

    /****************************************************************
     * 
     *            FUNÇÃO SIMPLEX E AUXILIARES DO SIMPLEX 
     * 
     ****************************************************************/

    //Metodo simplex (ainda não funcionando o de duas fases)
    function Simplex(matriz,numeroColunas){
        //Inicializando objetos necessarios para o simplex 
        var colunaPivo = {
                valorColuna: 0,      //Será o valor da linha da função objetivo na coluna indice
                indice: null
            };
        //
        var linhaPivo = {
                valorLinha: Infinity, 
                indice: null
            };
        //Guarda a coluna e a linha do pivo escolhido e o valor do pivo 
        var Pivo = {
                coluna: null, 
                linha: null, 
                valor: null
            }; 
        
        if(MaiorNegativo(matriz, numeroColunas, colunaPivo)){
            //Verificando a linha para haver a troca de bases
            if(MenorPositivo(matriz,colunaPivo,numeroColunas-1,linhaPivo)){
                //console.log(CopiarMatriz(matriz,matriz[0].length,numeroColunas));
                AtualizarPivo(Pivo, colunaPivo, linhaPivo, matriz);
                //Tirar da base e colocar na base 
                TrocarBases(matriz,Pivo.linha,Pivo.coluna);
                //Dividir a linha toda pelo valor do pivo
                DividirLinhaPivo(matriz,Pivo.linha, Pivo.valor);
                //Pivotar todas as linhas acima e a baixo do pivo
                PivotarColuna(matriz,Pivo.coluna,Pivo.linha); 
                //Armazenando os quadros
                ArrayQuadros[contQuadros++] = CopiarMatriz(matriz,numeroTotalLinhas,numeroTotalColunas);
                //Chamar novamente
                Simplex(matriz,numeroColunas);
            }else{
                //Verificando se existe variavel artificial na base
                if(BaseArtificial(matriz)){
                    console.log("Não existe divisão pela coluna positiva");
                    console.log("tem basica");
                }else {
                    console.log("Não existe divisão pela coluna positiva");
                    console.log("Não tem basica"); 
                }                
            }   
        }else {
            //Introduzir a verificação de existe variavel artificial na base ou não
            if(BaseArtificial(matriz)){
                console.log("Não existe maior negativo!");
                console.log("tem basica");
            }else {
                console.log("Não existe maior negativo!");
                console.log("Não tem basica");
            }                
        }
    }

    //Metodo para resolver um quadro de duas fases
    function SimplexPrimeiraFase(){

    }

    //Função para encontrar o mais negativo da linha da função objetivo
    function MaiorNegativo(matriz, numeroColunas, colunaPivo){
        //Encontrar maior negativo da ultima linha
        for(var i=1; i<numeroColunas; i++){
            if(matriz[numeroRestricoes+1][i] < colunaPivo.valorColuna){
                colunaPivo.valorColuna = matriz[numeroRestricoes+1][i]; 
                colunaPivo.indice = i;
            }
        }

        if(colunaPivo.valorColuna < 0)
            return true; 
        else return false;
    }

    //Função para encontrar o menor positivo da divisão da b pelos elementos da coluna
    function MenorPositivo(matriz,colunaPivo,vetorB, linhaPivo){
        //Encontrar menor positivo da divisão b pela linha
        for(var i=1; i<numeroRestricoes+1;i++){
            var aux;
            if(matriz[i][colunaPivo.indice] == 0){
                aux = -1;
            }else aux = matriz[i][colunaPivo.indice]
 
            var divisao = matriz[i][vetorB] / aux; 

            if(divisao < linhaPivo.valorLinha && divisao > 0){
                linhaPivo.valorLinha = divisao; 
                linhaPivo.indice = i;
            }
        }

        if(divisao > 0){
            return true; 
        }else return false; 
        
    }

    //Função para trocar os indices da tabela
    function TrocarBases(matriz, saiDaBase, entraNaBase){
        matriz[saiDaBase][0] = matriz[0][entraNaBase]; 
    }

    //Função para atualizar o pivo atual 
    function AtualizarPivo(Pivo, colunaPivo, linhaPivo, matriz){
        Pivo.coluna = colunaPivo.indice; 
        Pivo.linha = linhaPivo.indice; 
        Pivo.valor = matriz[linhaPivo.indice][colunaPivo.indice];
    }

    //Função para pivotar coluna de uma matriz 
    function PivotarColuna(matriz, coluna, linha){
        for(var i=1; i<=numeroRestricoes+1;i++){
            if(i != linha){
                var multiplicador =  matriz[i][coluna]/matriz[linha][coluna] ;
                for(var j=1; j<matriz[i].length; j++){
                    matriz[i][j] -= (multiplicador)*(matriz[linha][j]);
                }
            }
        }

    }

    //Função para dividir linha inteira pelo pivô
    function DividirLinhaPivo(matriz, linha, valorPivo){
        for(var i=1; i<matriz[linha].length; i++){
            matriz[linha][i] /= valorPivo;
        }
    }

    //Função para gerar uma nova matriz e armazena-lá no vetor de quadros 
    function CopiarMatriz(matriz,numeroLinhas, numeroColunas){
        var novaMatriz = new Array(); 
        for(var i=0; i<numeroLinhas;i++){
            novaMatriz[i] = new Array(); 
            for(var j=0; j<numeroColunas; j++){
                novaMatriz[i][j] = matriz[i][j]; 
            }
        }
        return novaMatriz; 
    }

    //Função para verificar se existem variaveis artificiais na base
    function BaseArtificial(matriz){

        for(var i=0; i<numeroRestricoes+2;i++){      
            if(matriz[i][0] != undefined){
                 var variavelBasica = matriz[i][0].split("-");

                if(variavelBasica[0] == "a"){
                    return true;
                }
            }
        }
        return false;
    }

    /***************************************************************
     * 
     *          FUNÇÕES PARA COLOCAR OS RESULTS NO MODAL 
     * 
     **************************************************************/

    function ModalResults(vetorDeMatriz,numLinhas, numColunas){

        // Div dentro do modal: divResultsModal

        $('#divResultsModal').empty(); 
        for(var i=0; i<vetorDeMatriz.length;i++){
            $('#divResultsModal').append('<div> <h3 class="text-center mb-10"> Quadro '+(i+1)+' </h3>  <table class="table table-hover table-responsive-sm" id="Quadro'+i+'"> <tbody>'); 
            for(var j=0; j<numLinhas; j++){
                $('#Quadro'+i+'').append('<tr id="linha'+j+'-'+i+'">');
                for(var k=0; k<numColunas; k++){
                    if(vetorDeMatriz[i][j][k] == undefined){
                        $('#linha'+j+'-'+i+'').append('<td>  </td>');  
                    }else {
                        var calc = vetorDeMatriz[i][j][k];
                        var numero = calc+""; 
                        var decimal = numero.indexOf("."); 
                        if(decimal != -1){
                            calc = calc.toFixed(4); 
                            calc = parseFloat(calc); 
                        }                        
                        if(j == 0){
                            $('#linha'+j+'-'+i+'').append('<th> '+ calc +' </th>');
                        }else if(j==2 && k == 2){
                            $('#linha'+j+'-'+i+'').append('<td class="table-success"> '+ calc +' </td>');
                        }else $('#linha'+j+'-'+i+'').append('<td> '+ calc +' </td>');

                    }
                    //console.log(vetorDeMatriz[i][j][k]);
                }  
                $('#Quadro'+i+'').append('</tr>');
            }
            $('#divResultsModal').append('</tbody> </table> </div>'); 
        }  


    }

    /***************************************************************
     * 
     *          FUNÇÕES PARA GERAR AS INPUTS DO PROBLEMA 
     * 
     **************************************************************/

    //Funções para criar os inputs de acordo com a quant. de Variaveis e Restrições 
    function FormRestricao(){
        //Id: restricoesProblema
        //O numero de restrições é a quantidade de linhas 
        for(var i=0; i<numeroRestricoes; i++){
            Acres('restricoesProblema','<form class="form-inline" id="linhaRestricao'+i+'"> </form>');
            for(var j=0; j<numeroVariaveis; j++){
                //Acres('linhaRestricao'+i,'<div class="col" id="coluna'+j+'Linha'+i+'"> </div>');
                if(j != numeroVariaveis-1)
                    Acres('linhaRestricao'+i,'<input type="number" class="form-control" name="xs" id="a'+i+'-'+j+'"> X<sub>'+j+'</sub> +');
                else Acres('linhaRestricao'+i,'<input type="number" class="form-control" name="xs" id="a'+i+'-'+j+'"> X<sub>'+j+'</sub>');
            }
            Acres('linhaRestricao'+i,'<select class="form-control" id="ine'+i+'"> <option value="1"> <= </option> <option value="0"> = </option> <option value="-1"> => </option> </select>');
            Acres('linhaRestricao'+i,'<input type="number" class="form-control" name="xs" id="b'+i+'">');
        }        
    }

    //Função para criar as inputs da função objetivo de acordo com o valor digitado.
    function FuncaoObjetivo(){

        //Id da função objetivo: funcaObjetivo
        var stringInput; 

        for(var i = 0; i < numeroVariaveis; i++ ){
            if(i != numeroVariaveis-1)
                stringInput = '<input type="number" name="xs" class="form-control" id="x'+i+'"> X<sub>'+i+'</sub>   + ';
            else stringInput = '<input type="number" name="xs" class="form-control" id="x'+i+'"> X<sub>'+i+'</sub>';
            Acres('funcaObjetivo',stringInput);
        }
        
    }

    /****************************************************************
     * 
     *                      EXEMPLOS PRÉ PROGRAMADOS
     * 
     ****************************************************************/

    function ZeMariaAparecida(){

        numeroRestricoes = 2; 
        numeroVariaveis = 2; 
        tipoDeProblema = 1; 

        document.getElementById('iniciarProblema').style.display = 'none';
        document.getElementById('tabelaDoProblema').style.display = 'block';

        var auxiliar = "Maximizar";
        $('#maxmin').replaceWith(auxiliar);

        FuncaoObjetivo();
        FormRestricao(); 

        //Função objetivo 
        AlterarValueInput('x0',1); 
        AlterarValueInput('x1',1); 

        //Matriz a
        //24 + 16 <= 96
        AlterarValueInput('a0-0',24);
        AlterarValueInput('a0-1',16);
        // 5 + 10 <= 45
        AlterarValueInput('a1-0',5);
        AlterarValueInput('a1-1',10);
        // 3 + 3 <= 18
        //AlterarValueInput('a2-0',3);
        //lterarValueInput('a2-1',3);
        
        //Vetor B
        AlterarValueInput('b0',96);
        AlterarValueInput('b1',45);
        //AlterarValueInput('b2',18);        
       
    }

    function ExemploIlimitado(){
        numeroRestricoes = 2; 
        numeroVariaveis = 2; 
        tipoDeProblema = 1; 

        document.getElementById('iniciarProblema').style.display = 'none';
        document.getElementById('tabelaDoProblema').style.display = 'block';

        var auxiliar = "Maximizar";
        $('#maxmin').replaceWith(auxiliar);

        FuncaoObjetivo();
        FormRestricao(); 

        //Função objetivo 
        AlterarValueInput('x0',1); 
        AlterarValueInput('x1',1); 

        //Matriz a
        //24 + 16 <= 96
        AlterarValueInput('a0-0',-1);
        AlterarValueInput('a0-1',1);
        // 5 + 10 <= 45
        AlterarValueInput('a1-0',1);
        AlterarValueInput('a1-1',-1);
        // 3 + 3 <= 18
        //AlterarValueInput('a2-0',3);
        //lterarValueInput('a2-1',3);
        
        //Vetor B
        AlterarValueInput('b0',2);
        AlterarValueInput('b1',2);
        //AlterarValueInput('b2',18);
    }

    /**************************************************************
     * 
     *      FUNÇÕES UTILITARIAS PARA FACILITAR A MINHA VIDA 
     * 
     **************************************************************/

    function LerValorId(stringId){
        return $('#'+stringId+'').val(); 
    }

    function LimparId(id){
        $('#'+id+'').empty(); 
    }

    function LimparClass(cl){
        $('.'+cl+'').empty(); 
    }

    function Acres(id,valor){
        $('#'+id+'').append(''+valor+'');
    }

    function AlterarValueInput(id, valor){
        document.getElementById(id).value = valor;    
    }

    function MultiplicaLinha(matriz, linha, valor){
        for(var i=0; i<matriz[linha].length; i++){
            matriz[linha][i] *= valor;
        }
    }