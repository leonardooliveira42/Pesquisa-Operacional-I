/**  */

    var variaveis; 
    var restricoes; 

function CriarTabela(){

    //Ler os valores das inputs 
    variaveis = $('#variveis').val(); 
    restricoes = $('#restricoes').val(); 

    console.log(variaveis); 
    console.log("Quantidade de restricoes " + restricoes); 

    //Limpando os valores anterioeres 
    $("#tabela_do_problema").empty();
    $("#tabela_do_problema").append("<br><br>");

    //Maximizar ou minimizar o problema?
    $('#tabela_do_problema').append(" <select class='custom-select' id='max_min'> <option value='1' selected> Minimizar</option> <option value='-1'> Maximizar</option> </select>");
    
    //Adicionando a função objetivo 
    $("#tabela_do_problema").append("Função Objetiva: <br> Z = ");
    for(var i = 1; i <= variaveis; i++){
        $("#tabela_do_problema").append("<input type='number' class='variaveis' id='z"+i+"'> X<sub>"+ i+ "</sub> ")
    }
    $("#tabela_do_problema").append("<br>");

    //Colocando as restrições 
    $("#tabela_do_problema").append("<br> Sujeito a: <br>");
    for(var i = 1; i <= restricoes; i++){
        for(var j = 1; j <= variaveis; j++){
            $("#tabela_do_problema").append("<input type='number' class='variaveis' id='A"+i+j+"'>X<sub>"+i+"</sub>");
            if(j!=variaveis) 
                $("#tabela_do_problema").append(" + ");
        }

        //Colocando o vetor b 
        $("#tabela_do_problema").append(" <select class='select_desi'> <option selected> <= </option> </select>")
        $("#tabela_do_problema").append(" <input type='number' class='variaveis'> ");
        $("#tabela_do_problema").append("<br>");
    }

    //Colocar um botão 
    $("#tabela_do_problema").append("<br>");
    $("#tabela_do_problema").append("<button type='button' class='btn btn-success' onclick='MetodoSimplex()'> Simplexar </button>");

}

function FormaPadrao (){

    //Verificar se é para maximizar ou minimizar 
    var max = $("#max_min").val(); 
    console.log("max ou min: " + max);  

    //Coeficientes da função objetivo: 
    var coeficientesFuncObjetiva = new Array();
    var continua = true; 
    var lerValor; 
    var auxiliar; 

    for(var i = 1; continua; i ++){
        lerValor = $("#z"+i+"").val(); 
        if(lerValor != undefined){
            coeficientesFuncObjetiva[i-1] = lerValor; 
        }else{
            continua = false; 
            auxiliar = i-1; 
        }
    }

    for(var j = auxiliar; j < parseInt(auxiliar+restricoes); j++){
        coeficientesFuncObjetiva[j] = 0 ;
    }


    //Alterando valores para a forma padrão 
    coeficientesFuncObjetiva = MultiplicaVetor(coeficientesFuncObjetiva, max); 

    console.log("Vetor z: " + coeficientesFuncObjetiva); 
 
}

function MultiplicaVetor (vector, multiplicador){

    for( var i = 0; i < vector.length; i++){
        vector[i] *= multiplicador; 
    }
    return vector
}

function MetodoSimplex(){

    //Funçao para resolver o problema de otimização 
    FormaPadrao();
    
}