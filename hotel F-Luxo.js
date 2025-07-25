//1- primeiro definir as características do login
class Usuário {
    constructor(id, cpf, email, senha) {
        this.id = id;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

class Cliente extends Usuário {
    constructor(id, cpf, email, senha) {
        super(id, cpf, email, senha);
    }
}
//-------------fim(1)-------------

class Quartos {
    constructor(camas, preço, quantidade) {
        this.camas = camas;
        this.preço = preço;
        this.quantidade = quantidade;
    }
}
//Ideia de gestão de dados 1 --> O ID único de cada cliente vai ser o índice da matriz
//matriz clientes: [[nome,data de nascimento,cpf,email,senha],
// [gabriel,23/07/03,11122233344, gabriel@gmail.com,chicletecombanana]]
// iteração simples atrávez da matriz para achar os dados

class Sistema {
    constructor(clientes, Quartos) {
        this.clientes = [];
        this.quartos = [];

    }
}


//definir o que irá aparecer para o usuário
console.log("-".repeat(10) + " escolha uma opção " + "-".repeat(10));
console.log("1: Fazer login");
console.log("2: Cadastre-se");