
    //VARIAVEIS GLOBAIS 
    var numeroVariaveis = 0; 
    var numeroRestricoes = 0; 
    var tipoDeProblema = 0; 

    //Um array de matrizes 
    var ArrayQuadros = new Array(); 
    var contQuadros = 0; 

    $(document).ready(function(){
        ZeMariaAparecida(); 
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

    //Lê os dados das inputs e coloca em uma matriz 
    function FormParaMatriz(){
        var fObj = new Array(); 

        //Lendo 
        for(var i=0; i<numeroVariaveis; i++){
            if(LerValorId('x'+i) == '')
                fObj[i] = 0;
            else fObj[i] = LerValorId('x'+i);
        }

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

        matriz[numeroRestricoes] = new Array(); 

        for(var i=0; i<numeroVariaveis;i++){
            var aux = fObj[i]; 
            if(aux == '')
                aux = 0; 
            else aux = parseInt(aux); 
            matriz[numeroRestricoes][i] = aux;
        }
        
        //Passar para forma padrão 
        FormaPadrao(matriz);
    }

    //Função para transformar a matriz lida em uma matriz na forma padrão 
    function FormaPadrao(MatrizLida){

        var posVetorB = MatrizLida[0].length - 1; 
        var posIneq = MatrizLida[0].length - 2; 

        //Criando uma matriz auxiliar 
        var MatrizAuxiliar = new Array(numeroRestricoes+3);
        for(var i=0; i<numeroRestricoes+2;i++){
            MatrizAuxiliar[i] = new Array(); 
        } 

        //Fazer as verificações do vetor b
        for(var i=0; i<numeroRestricoes+1; i++){
            if(MatrizLida[i][numeroVariaveis+1] < 0){
                //Fazer alteração necessaria do vetor b
                MultiplicaLinha(MatrizLida,i,-1); 
            }
        }      

        //Calculando o total maximo de colunas
        var numeroColunasPadrao = numeroVariaveis + 1; 
        for(var i=0; i<numeroRestricoes;i++){
            switch(MatrizLida[i][posIneq]){
                case 1: 
                case 0: 
                    numeroColunasPadrao++; 
                    break; 
                case -1: 
                    numeroColunasPadrao += 2;
                    break;
            }
        }       

        //Transição da matriz lida para a matrizPadrao
        var quantArtificias = 0; 
        for(var i=0; i<numeroRestricoes; i++){
            for(var j=0; j<numeroVariaveis; j++){
                //Escreve o indice na primeira linha da matriz
                MatrizAuxiliar[0][j+1] = 'x'+j;
                //Copia os dados da matriz lida para a matriz padrao
                MatrizAuxiliar[i+1][j+1] = MatrizLida[i][j];
                //Se a copia atingiu o limite o algoritmo executa isso:
                if(j == numeroVariaveis-1){
                    for(var k=0; k<numeroColunasPadrao-numeroVariaveis; k++){
                        //Aqui vai preencher as outras colunas do quadro simplex
                        if(k-quantArtificias == i){
                            switch(MatrizLida[i][posIneq]){
                                //Caso a inequação for <= somente adiciona uma folga
                                case 1: 
                                    MatrizAuxiliar[i+1][k+1+numeroVariaveis] = 1; 
                                    MatrizAuxiliar[0][k+1+numeroVariaveis] = 'f-'+i; 
                                    MatrizAuxiliar[i+1][0] = 'f-'+i;
                                    break; 
                                //caso seja uma igualdade, só será adicionado uma artificial 
                                case 0: 
                                    MatrizAuxiliar[i+1][k+1+numeroVariaveis] = 1; 
                                    MatrizAuxiliar[0][k+1+numeroVariaveis] = 'a-'+i; 
                                    MatrizAuxiliar[i+1][0] = 'a-'+i;
                                    break; 
                                //caso seja maior ou igual, será adicionado uma folga negativa e uma artificial 
                                case -1: 
                                    MatrizAuxiliar[i+1][k+1+numeroVariaveis] = -1; 
                                    MatrizAuxiliar[0][k+1+numeroVariaveis] = 'f-'+i;  
                                    k++;
                                    MatrizAuxiliar[i+1][k+1+numeroVariaveis] = 1; 
                                    MatrizAuxiliar[0][k+1+numeroVariaveis] = 'a-'+i; 
                                    MatrizAuxiliar[i+1][0] = 'a-'+i;
                                    quantArtificias++;
                                    break; 
                            }
                        }else{
                            if(k == numeroColunasPadrao-numeroVariaveis-1){
                                MatrizAuxiliar[i+1][k+1+numeroVariaveis] = MatrizLida[i][posVetorB];
                            }
                            else MatrizAuxiliar[i+1][k+1+numeroVariaveis] = 0; 
                        }
                    }
                }
            }
        }

        MatrizAuxiliar[numeroRestricoes+1][0] = 'Z'; 
        //Colocando a linha da função objetivo 
        for(var i=0; i<numeroColunasPadrao; i++){
            if(MatrizLida[numeroRestricoes][i] == undefined){
                MatrizAuxiliar[numeroRestricoes+1][i+1] = 0;
            }else {
                var aux; 
                if(tipoDeProblema == 1){
                    aux = -1; 
                }else aux = 1; 
                MatrizAuxiliar[numeroRestricoes+1][i+1] = MatrizLida[numeroRestricoes][i] * aux;
            }
        }

        if(quantArtificias > 0){
            MatrizAuxiliar[numeroRestricoes+2] = new Array(); 
            MatrizAuxiliar[numeroRestricoes+2][0] = 'W';
            //Adicionando a linha w a matriz
            for(var i=1; i<numeroColunasPadrao; i++){
                var valorColuna = 0; 
                for(var j=1;j<=numeroRestricoes;j++){
                    var aux = MatrizAuxiliar[j][0].split("-");
                    if(aux[0] == 'a'){  //é uma linha artificial 
                       valorColuna += MatrizAuxiliar[j][i];
                    }
                }
                MatrizAuxiliar[numeroRestricoes+2][i] = valorColuna * (-1);
            }
            MatrizAuxiliar[numeroRestricoes+2][numeroColunasPadrao] = 0; 
        }

        //console.log(MatrizAuxiliar);      
        ArrayQuadros[contQuadros++] = CopiarMatriz(MatrizAuxiliar,numeroRestricoes+2,numeroColunasPadrao+1);
        Simplex(MatrizAuxiliar,numeroColunasPadrao);

        console.log("numero de quadros: " + contQuadros);
        console.log(ArrayQuadros);
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

        MaiorNegativo(matriz, numeroColunas, colunaPivo);        
        
        if(colunaPivo.valorColuna < 0){
            MenorPositivo(matriz,colunaPivo,numeroColunas, linhaPivo);
            AtualizarPivo(Pivo, colunaPivo, linhaPivo, matriz);
            //Tirar da base e colocar na base 
            TrocarBases(matriz,Pivo.linha,Pivo.coluna);
            //Dividir a linha toda pelo valor do pivo
            DividirLinhaPivo(matriz,Pivo.linha, Pivo.valor);
            //Pivotar todas as linhas acima e a baixo do pivo
            PivotarColuna(matriz,Pivo.coluna,Pivo.linha); 
            //Armazenando os quadros
            ArrayQuadros[contQuadros++] = CopiarMatriz(matriz,numeroRestricoes+2,numeroColunas+1);
            //Chamar novamente
            Simplex(matriz,numeroColunas);
        }else console.log("condição de parada da recursão");
    }

    //Função para trocar os indices da tabela
    function TrocarBases(matriz, saiDaBase, entraNaBase){
        matriz[saiDaBase][0] = matriz[0][entraNaBase]; 
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
    }

    //Função para encontrar o menor positivo da divisão da b pelos elementos da coluna
    function MenorPositivo(matriz,colunaPivo,numeroColunas, linhaPivo){
        //Encontrar menor positivo da divisão b pela linha
        for(var i=1; i<numeroRestricoes+1;i++){
            //console.log(matriz[i][numeroColunas]);
            var aux;
            if(matriz[i][colunaPivo.indice] == 0){
                aux = -1;
            }else aux = matriz[i][colunaPivo.indice]
            //console.log(aux); 
            var divisao = matriz[i][numeroColunas] / aux; 
            //console.log("Resultado divisão: " + divisao); 
            if(divisao < linhaPivo.valorLinha && divisao > 0){
                linhaPivo.valorLinha = divisao; 
                linhaPivo.indice = i;
            }
        }
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