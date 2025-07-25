// 1- primeiro definir as características do login
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
        this.nome = nome;
    }
}

class Funcionario extends Usuário {
    constructor(id, cpf, email, senha, nome_de_usuario) {
        super(id, cpf, email, senha);
        this.nome_de_usuario = nome_de_usuario;
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

class Sistema {
    constructor(clientes, Quartos) {
        this.clientes = [];
        this.Funcionarios = [];
        this.proximoID = 1;
    }

    cadastrarCliente(nome, email, senha) {
        const novoCLiente = new Cliente(this.proximoID, nome, email, senha);
        this.clientes.push(novoCLiente);
        this.proximoID += 1;
        return novoCLiente;
    }
    
    fazerLogin(email, senha) {
        //achar o cliente usando for
        let buscarCLiente = null;
        for (const cliente of this.clientes) {
            if (cliente.email == email && i.senha == senha) {
                buscarCLiente = cliente;
                break;
            }
        }
        //identificar se há ou não cadastro
        if (buscarCLiente) {
            console.log("Login bem sucedido");
            return buscarCLiente;
        } else {
            console.log("Cliente não encontrado");
            return null
        }
    }

}


//definir o que irá aparecer para o usuário
console.log("=".repeat(10) + " escolha uma opção " + "=".repeat(10));
console.log("1: Fazer login");
console.log("2: Cadastre-se");
console.log("3: Sair do programa");