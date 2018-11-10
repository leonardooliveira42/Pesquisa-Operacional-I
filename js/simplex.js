
    //VARIAVEIS GLOBAIS 
    var numeroVariaveis = 0; 
    var numeroRestricoes = 0; 
    var tipoDeProblema = 0; 

    //Criando a matriz 
    var matriz = new Array(); 

    //
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
            Acres('linhaRestricao'+i,'<select class="form-control" id="ine'+i+'"> <option value="1"> <= </option> <option value="2"> < </option> <option value="3"> = </option> <option value="4"> > </option> <option value="5"> => </option> </select>');
            Acres('linhaRestricao'+i,'<input type="number" class="form-control" name="xs" id="b'+i+'">');
        }        
    }

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