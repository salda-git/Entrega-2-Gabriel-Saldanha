var requisicao = require('readline-sync')
//definir as características do login
class Usuário {
    constructor(cpf, email, senha) {
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

class Cliente extends Usuário {
    constructor(id_cliente, cpf, email, senha) {
        super(cpf, email, senha);
        this.id_cliente = id_cliente
        this.nome = nome;
    }
}

class Funcionario extends Usuário {
    constructor(id_funcionario, cpf, email, senha, nome_de_usuario) {
        super(cpf, email, senha);
        this.id_funcionario = id_funcionario
        this.nome_de_usuario = nome_de_usuario;
    }
}

class Quartos {
    constructor(tipoDeQuarto, camas, preço, quantidade) {
        this.tipoDeQuarto = tipoDeQuarto;
        this.camas = camas;
        this.preço = preço;
        this.quantidade = quantidade;
    }
}

class Reserva {
    constructor(id_reserva, id_cliente, tipoDeQuarto, checkin, checkout, status) {
        this.id_cliente = id_cliente;
        this.tipoDeQuarto = tipoDeQuarto
        this.status = status;
        this.id_reserva = id_reserva;
        this.checkin = checkin;
        this.checkout = checkout;
    }
}


//definindo a funcionalidades
class Sistema {
    constructor() {
        this.clientes = [];
        this.funcionarios = [];
        this.quartos = [];
        this.reservas = []
        this.proximoID_cliente = 1;
        this.proximoID_funcionario = 1;
        this.proximoID_reserva = 1;
    }

    cadastrarUsuario(nome, email, senha, cliente_ou_funcionario) {
        //diferenciar cliente e funcionario por: cliente = 1, funcionario = 2
        //FALTA LEVANTAR OS ERROS

        if (cliente_ou_funcionario === "1") {
            for (const i of this.clientes) {
                if (i.email === email) {
                    console.log("Cliente ja cadastrado")
                    return null
                }
            }
            const novoCLiente = new Cliente(this.proximoID_cliente, nome, email, senha, cliente_ou_funcionario);
            this.clientes.push(novoCLiente);
            this.proximoID_cliente += 1;
            console.log("Cadastro realizado com sucesso!")

            return novoCLiente;

        } else if (cliente_ou_funcionario === "2") {
            for (const i of this.funcionarios) {
                if (i.email === email) {
                    console.log("Funcionário ja cadastrado")
                    return null
                }

            }
            const novoFuncionario = new Funcionario(this.proximoID_funcionario, nome, email, senha, cliente_ou_funcionario);
            this.funcionarios.push(novoFuncionario);
            this.proximoID_funcionario += 1;
            console.log("Cadastro realizado com sucesso!");

            return novoFuncionario;

        }
    }

    fazerLogin(email, senha) {
        //achar o usuario usando for
        //1 - ver se o usuário é cliente
        let buscarUsuario = null;

        for (const usuario of this.clientes) {
            if (usuario.email == email && usuario.senha == senha) {
                buscarUsuario = usuario;
                break;

            }
        }

        //2 - ver se o usuário é funcionário  
        for (const usuario of this.funcionarios) {

            if (usuario.email === email && usuario.senha === senha) {
                buscarUsuario = usuario
                break;
            }
        }

        //identificar se há ou não cadastro
        if (buscarUsuario) {
            console.log("\nLogin bem sucedido!\n");
            return buscarUsuario;
        } else {
            console.log("\nUsuário não encontrado.");
            return null
        }
    }

    adicionarQuarto(nome, camas, diaria, quantidade) {
        const novoQuarto = new Quartos(nome, camas, diaria, quantidade);
        this.quartos.push(novoQuarto);
        console.log(`${novoQuarto.nome} adicionado com sucesso!`)
        return novoQuarto;
    }

    listarQuartos() {
        let x = 1
        for (const quarto of sistema.quartos) {
            console.log(`${x}: ${quarto.tipoDeQuarto}`)
            x += 1;
        }
        let voltar = x
        console.log(`${voltar}: voltar para Àrea do Cliente`);
        numeroListaQuartos = requisicao.question("Digite o numero do quarto para ver os detalhes ou para voltar:")
        const valor = parseInt(numeroListaQuartos);

        if (valor == voltar) {
            return
        }

        if (valor > 0 && valor < voltar) {
            const indiceQuarto = valor - 1;
            const quartoSelecionado = sistema.quartos(indiceQuarto);

            console.log(`Nome: ${quartoSelecionado.tipoDeQuarto}`);
            console.log(`Camas: ${quartoSelecionado.camas}`);
            console.log(`Diária: ${quartoSelecionado.diaria}`);
            console.log(`Disponibilidade: ${quartoSelecionado.quantidade}`);
        } else {
            console.log('Opção inválida')
        }
    }
    fazerReserva(tipoDeQuartoReserva, id_cliente, checkin, checkout) {
        //encontrar o quarto
        let quartoEncontrado = null
        for (const i of this.quartos) {
            if (i.tipoDeQuarto === tipoDeQuartoReserva) {
                quartoEncontrado = i;
                break;
            }
        }

        //verificar se há disponibilidade e fazer reserva
        if (quartoEncontrado && quartoEncontrado.quantidade > 0) {
            const novaReserva = new Reserva(this.proximoID_reserva, id_cliente, tipoDeQuarto, checkin, checkout)


            this.reservas.push(novaReserva);
            this.proximoID_reserva += 1;
            quartoEncontrado.quantidade -= 1;

            console.log(`Reserva para ${tipoDeQuarto} realizada com sucesso!`);
            return novaReserva;
        } else {
            console.log(`Não há ${tipoDeQuarto} disponíveis`);
            return null;
        }
    }
}

const sistema = new Sistema;

sistema.adicionarQuarto("Suite", 2, 300, 5);
sistema.adicionarQuarto("Quarto Standard", 2, 150, 10);
sistema.adicionarQuarto("Quarto Família", 4, 250, 3);


//definir o que irá aparecer para o usuário no console
let sairDoPrograma = false;
while (!sairDoPrograma) {


    console.log("\n" + "=".repeat(10) + " escolha uma opção " + "=".repeat(10));
    console.log("1: Fazer login");
    console.log("2: Cadastre-se");
    console.log("3: Sair do programa");
    const numeroMenuPrincipal = requisicao.question("Opcao escolhida: ")

    switch (numeroMenuPrincipal) {
        case "1":
            console.log("\n" + "=".repeat(40));
            email = requisicao.question("Email: ");
            senha = requisicao.question("Senha: ");
            const usuarioLogado = sistema.fazerLogin(email, senha);

            //entrando na aba de login do usuario

            if (usuarioLogado) {
                //Verificar se o usuario é cliente ou funcionario para redireciona-lo
                if (usuarioLogado instanceof Cliente) {

                    console.log(`Bem vindo(a), ${usuarioLogado.nome}!\n`);

                    let sairDaAreaDoCliente = false;
                    while (!sairDaAreaDoCliente) {
                        console.log("=".repeat(12) + "Área do Cliente" + "=".repeat(12));
                        console.log("1: Ver Meus Dados");
                        console.log("2: Ver Lista de Quartos");
                        console.log("3: Fazer reserva")
                        console.log("4: Cancelar reserva");
                        console.log("5: Ver minhas reservas");
                        console.log("6: Voltar ao Menu Pricipal");
                        const numeroÁreaCLiente = requisicao.question("Opcao escolhida: \n");

                        switch (numeroÁreaCLiente) {
                            case "1":
                                console.log("\n" + "=".repeat(40));
                                console.log(`${usuarioLogado.nome}`);
                                console.log(`${usuarioLogado.email}`);
                                break;

                            //listar os quartos disponiveis, com a opção de clicar para ver os seus detalhes
                            case "2":
                                sistema.listarQuartos();
                                break

                            case "3":
                                break

                            case "6":
                                sairDaAreaDoCliente = true
                                break;

                        }

                    }

                } else if (usuarioLogado instanceof Funcionario) {
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
            console.log("\n" + "=".repeat(40));
            tipo_de_cadastro = requisicao.question("Qual o tipo do Cadastro?\n1: Cadastro de cliente \n2: Cadastro de funcionario\nResposta: ")
            nome = requisicao.question("Nome: ")
            email = requisicao.question("Email: ");
            senha = requisicao.question("Senha: ");
            sistema.cadastrarUsuario(nome, email, senha, tipo_de_cadastro);
            break;

        case "3":
            sairDoPrograma = true;
            break;
    }
}


