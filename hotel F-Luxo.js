var requisicao = require('readline-sync')
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

//definindo a funcionalidades
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
        console.log("Cadastro realizado com sucesso!")
        return novoCLiente;
    }

    fazerLogin(email, senha) {
        //achar o usuario usando for
        let buscarCLiente = null;
        for (const usuario of this.usuario) {
            if (usuario.email == email && usuario.senha == senha) {
                buscarUsuario = usuario;
                break;

            }
        }
        //identificar se há ou não cadastro
        if (buscarCLiente) {
            console.log("Login bem sucedido");
            return c;
        } else {
            console.log("Cliente não encontrado");
            return null
        }
    }

}

const sistema = new Sistema;

//definir o que irá aparecer para o usuário
let sair = false;
while (!sair) {


    console.log("=".repeat(10) + " escolha uma opção " + "=".repeat(10));
    console.log("1: Fazer login");
    console.log("2: Cadastre-se");
    console.log("3: Sair do programa");
    const numeroMenuPrincipal = requisicao.question("Opcao escolhida: ")

    switch (numeroMenuPrincipal) {
        case "1":
            console.log("=".repeat(40));
            email = requisicao.question("Email: ");
            senha = requisicao.question("Senha: ");
            sistema.fazerLogin(email, senha);
            break;

        case "2":
            console.log("=".repeat(40));
            nome = requisicao.question("Nome: ")
            email = requisicao.question("Email: ");
            senha = requisicao.question("Senha: ");
            sistema.cadastrarUsuario(nome, email, senha, );
            break;

        case "3":
            sair = true;
            break;
    }

}
