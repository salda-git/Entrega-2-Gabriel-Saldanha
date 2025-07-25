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
    constructor(usuario, quartos, funcionarios) {
        this.usuarios = [];
        this.funcionarios = [];
        this.proximoID = 1;
    }

    cadastrarUsuario(nome, email, senha, cliente_ou_funcionario) {
        //diferenciar cliente e funcionario por: cliente = 1, funcionario = 2

        if (cliente_ou_funcionario == "1") {
            const novoCLiente = new Cliente(this.proximoID, nome, email, senha, cliente_ou_funcionario);
            this.usuarios.push(novoCLiente);
            this.proximoID += 1;
            console.log("Cadastro realizado com sucesso!")

            return novoCLiente;

        } else if (cliente_ou_funcionario == "2") {
            const novoFuncionario = new Funcionario(this.proximoID, nome, email, senha, cliente_ou_funcionario);
            this.usuarios.push(novoFuncionario);
            this.proximoID += 1;
            console.log("Cadastro realizado com sucesso!")

            return novoFuncionario;
        }
    }

    fazerLogin(email, senha) {
        //achar o usuario usando for
        let buscarUsuario = null;
        for (const usuario of this.usuarios) {
            if (usuario.email == email && usuario.senha == senha) {
                buscarUsuario = usuario;
                break;

            }
        }
        //identificar se há ou não cadastro
        if (buscarUsuario) {
            console.log("Login bem sucedido!");
            return buscarUsuario;
        } else {
            console.log("Cliente não encontrado.");
            return null
        }
    }

}

const sistema = new Sistema;

//definir o que irá aparecer para o usuário
let sairDoPrograma = false;
while (!sairDoPrograma) {


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
            const usuarioLogado = sistema.fazerLogin(email, senha);

            //entrando na aba de login do usuario

            if (usuarioLogado) {
                switch (usuarioLogado.cliente_ou_funcionario) {
                    case "1":
                        console.log(`Bem vindo(a), ${usuarioLogado.nome}!`);

                        let sairDaAreaDoCliente = false;
                        while (!sairDaAreaDoCliente) {
                            console.log("=".repeat(12) + "Área do Cliente" + "=".repeat(12));
                            console.log("1: Ver Meus Dados");
                            console.log("2: Ver Lista de Quartos");
                            console.log("3: Fazer reserva")
                            console.log("4: Cancelar reserva");
                            console.log("5: Ver minhas reservas");
                            console.log("6: Voltar ao Menu Pricipal");
                            const numeroÁreaCLiente = requisicao.question("Opcao escolhida: ");

                            switch (numeroÁreaCLiente) {
                                case "1":
                                    console.log(`${usuarioLogado.nome}`);
                                    console.log(`${usuarioLogado.email}`);

                                case "6":
                                    sairDaAreaDoCliente = true
                                    break;

                            }

                        }
                    case "2":
                        console.log(`Bem vindo(a) ${usuarioLogado.nome}`);

                        let sairDaAreaDoFuncionário = false;
                        while (!sairDaAreaDoFuncionário) {
                            console.log("=".repeat(12) + "Área do Funcionáro" + "=".repeat(12));
                            console.log("1: Ver Meus Dados");
                            console.log("2: Ver Lista de Reservas");
                            console.log("3: Ver Lista de Quartos")
                            console.log("4: Ver Lista de Clientes");
                            console.log("5: Mudar Status da Reserva");
                            console.log("6: Adicionar Quarto");
                            const numeroÁreaFuncioario = requisicao.question("Opcao escolhida: ");

                            switch (numeroÁreaFuncioario) {
                                case "6":
                                    sairDaAreaDoFuncionário = true;
                                    break;
                            }

                        }


                }
            }

            break;

        case "2":
            console.log("=".repeat(40));
            nome = requisicao.question("Nome: ")
            email = requisicao.question("Email: ");
            senha = requisicao.question("Senha: ");
            sistema.cadastrarUsuario(nome, email, senha,);
            break;

        case "3":
            sairDoPrograma = true;
            break;
    }
}
