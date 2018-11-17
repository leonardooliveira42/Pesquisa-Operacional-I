
    //VARIAVEIS GLOBAIS 
    var numeroVariaveis = 0; 
    var numeroRestricoes = 0; 
    var tipoDeProblema = 0; 

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

    function FormaPadrao(){

        //Fazer as verificações do vetor b

            //Fazer alteração necessaria do vetor b

        //Adicionar uma variavel extra para cada linha se for uma inequação

        
        //Fazer verificação das inequações 

            // Adicionar as variaveis artificiais se necessario 

        //Adicionar os coeficientes na função objetivo 

        //Manipular função objetivo 

        //Adicionar função objetivo na ultima linha da matriz

        //Chamar simplex

    }

    function Simplex(){

        //Encontrar menor negativo da ultima linha

        //Encontrar menor positivo da divisão b pela linha

        //Dividir a linha toda pelo valor do pivo

        //Pivotar todas as linhas acima e a baixo do pivo

        //Chamar novamente

    }

    //Função para pivotar coluna de uma matriz 
    function PivotarColuna(){

    }

    //Função para dividir linha inteira pelo pivô
    function DividirLinhaPivo(){

    }

    /***************************************************************
     * 
     *      FUNÇÕES PAR GERAR AS INPUTS DO PROBLEMA 
     * 
     **************************************************************/

    //Colocando para matriz - Talvez não irei utilizar 
    function FormParaMatriz(){
        var fObj = new Array(); 

        //Lendo 
        for(var i=0; i<numeroVariaveis; i++){
            fObj[i] = LerValorId('x'+i);
        }

        for(var i=0; i<numeroRestricoes; i++){
            matriz[i] = new Array(); 
            for(var j=0; j<numeroVariaveis; j++){
                matriz[i][j] = parseInt(LerValorId('a'+i+'-'+j+''));
                if(j == numeroVariaveis-1){
                    matriz[i][j+1] = parseInt(LerValorId('b'+i));
                }
            }
        }

        console.log(matriz);    

        matriz[numeroRestricoes] = new Array(); 

        for(var i=0; i<numeroVariaveis;i++){
            matriz[numeroRestricoes][i] = fObj[i];
        }

        console.log(matriz);        
    }

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
            Acres('linhaRestricao'+i,'<select class="form-control" id="ine'+i+'"> <option value="1"> <= </option> <option value="2"> = </option> <option value="3"> => </option> </select>');
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