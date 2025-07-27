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
        this.tipoDeQuarto = tipoDeQuarto;
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
    //-----------funções pagina inicial----------------
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
    //---------------funções cliente----------------

    listarQuartosDetalhes() {
        let x = 1
        for (const quarto of sistema.quartos) {
            console.log(`${x}: ${quarto.tipoDeQuarto}`)
            x += 1;
        }
        let voltar = x
        console.log(`${voltar}: voltar para Àrea do Cliente`);
        const numeroListaQuartos = requisicao.question("Digite o numero do quarto para ver os detalhes ou para voltar:")
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

    fazerReserva(tipoDeQuarto, id_cliente, checkin, checkout) {
        //encontrar o quarto
        let quartoEncontrado = null
        for (const i of this.quartos) {
            if (i.tipoDeQuarto === tipoDeQuarto) {
                quartoEncontrado = i;
                break;
            }
        }

        //verificar se há disponibilidade e fazer reserva
        if (quartoEncontrado && quartoEncontrado.quantidade > 0) {
            const novaReserva = new Reserva(this.proximoID_reserva, id_cliente, tipoDeQuarto, checkin, checkout, 'pendente')


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

    cancelarReserva(usuarioLogado) {
        //filtrar as reservas desse cliente
        const reservasDoCliente = [];
        for (const reserva of this.reservas) {
            if (reserva.id_cliente === usuarioLogado.id_cliente) {
                reservasDoCliente.push(reserva)
            }

        }

        if (reservasDoCliente.length === 0) {
            console.log("Nenhume reserva encontrada")
            return
        }

        //listar as reservas da lista filtrada
        let x = 1;
        for (const reserva of reservasDoCliente) {
            if (reserva.id_cliente == usuarioLogado.id_cliente) {
                console.log(`Reserva número: ${reserva.id_reserva} | Quarto: ${reserva.tipoDeQuarto} | entrada: ${reserva.checkin} | saída: ${reserva.checkout} | status: ${reserva.status}`)
                x += 1;
            }
        }
        //Usuario escolhe qual reserva vai cancelar
        console.log(`${x}: Voltar`)
        const escolha = requisicao.question("Qual reserva deseja cancelar?");
        const valorEscolha = parseInt(escolha);

        let voltar = x
        if (valorEscolha == voltar) {
            return
        }

        //separar o indice e mudar o status da reserva
        if (valorEscolha > 0 && valorEscolha < voltar) {
            const inidiceDaReserva = valorEscolha - 1;
            const reservaParaCancelar = reservasDoCliente[inidiceDaReserva]

            if (reservaParaCancelar.status !== "Pendente") {
                console.log("Não é possível canelar a reserva")
                return
            }

            reservaParaCancelar.status = "Cancelada;"

            //atualizar a disponibilidade do quarto
            let quartoCancelado = null;
            for (const quarto of this.quartos) {
                if (quarto.tipoDeQuarto === reservaParaCancelar.tipoDeQuarto) {
                    quartoCancelado = quarto
                    break;
                }
            }

            if (quartoCancelado) {
                quartoCancelado.quantidade += 1;
            }

            console.log(`\nReserva para o quarto ${reservaParaCancelar.tipoDeQuarto} cancelada com sucesso!`)

        } else {
            console.log('Opção inválida')
        }

    }

    listarReservasCliente(usuarioLogado) {
        //filtrar as reservas desse cliente
        const reservasDoCliente = [];
        for (const reserva of this.reservas) {
            if (reserva.id_cliente === usuarioLogado.id_cliente) {
                reservasDoCliente.push(reserva)
            }

        }

        if (reservasDoCliente.length === 0) {
            console.log("Nenhuma reserva encontrada")
            return
        }

        let x = 1;
        for (const reserva of reservasDoCliente) {
            console.log(`${x}: Quarto: ${reserva.tipoDeQuarto} | ` +
                `Check-in: ${reserva.checkin} | ` +
                `Checkout: ${reserva.checkout} | ` +
                `Status: ${reserva.status}`)
            x += 1
        }
    }

    //---------------funções funcionário---------------
    adicionarQuarto(tipoDeQuarto, camas, diaria, quantidade) {
        const novoQuarto = new Quartos(tipoDeQuarto, camas, diaria, quantidade);
        this.quartos.push(novoQuarto);
        console.log(`${novoQuarto.tipoDeQuarto} adicionado com sucesso!`)
        return novoQuarto;
    }

    listarQuartosReserva(usuarioLogado) {
        let x = 1
        for (const quarto of sistema.quartos) {
            console.log(`${x}: ${quarto.tipoDeQuarto}`)
            x += 1;
        }
        let voltar = x
        console.log(`${voltar}: voltar para Àrea do Cliente`);
        const numeroListaQuartos = requisicao.question("Qual quarto deseja reservar?: ")
        const valor = parseInt(numeroListaQuartos);

        if (valor == voltar) {
            return
        }

        if (valor > 0 && valor < voltar) {
            const indiceQuarto = valor - 1;
            const quartoSelecionado = this.quartos[indiceQuarto];

            console.log(`Qual a data de entrada e saída?`);
            console.log("Use o padrão XX/XX/XXXX")
            const checkin = requisicao.question("Checkin: ")
            const checkout = requisicao.question("Checkout: ")
            this.fazerReserva(quartoSelecionado.tipoDeQuarto, usuarioLogado.id_cliente, checkin, checkout)

        } else {
            console.log('Opção inválida')
        }
    }

    listarReservas() {
        console.log('\n--- Lista de Todas as Reservas ---');

        if (this.reservas.length === 0) {
            console.log('Nenhuma reserva foi feita');
            return false;
        }

        let x = 1
        for (const reserva of this.reservas) {
            console.log(`${x}: ${reserva.id_reserva} | ${reserva.id_cliente} | ${reserva.tipoDeQuarto} | ${reserva.checkin}| ${reserva.checkout}| ${reserva.status}`)
            x += 1;
        }
        return true
    }

    listarClientes() {
        let x = 1
        for (const cliente of this.clientes) {
            console.log(`${x}: ${cliente.id_cliente} | ${x}: ${cliente.nome} | ${x}: ${cliente.email} | `)
            x += 1;
        }
    }

    mudarStatusReserva() {
        console.log('\n--- Alterar Status da Reserva ---');
        const haReservas = this.listarReservas();

        if (!haReservas) {
            return;
        }

        const escolhaReserva = requisicao.question('\nDigite o numero da reserva que deseja alterar: ');
        const indice = parseInt(escolhaReserva) - 1;

        // ETAPA 3: Validar a escolha do funcionário.
        if (indice >= 0 && indice < this.reservas.length) {
            const reservaParaMudar = this.reservas[indice];

            // ETAPA 4: Pedir o novo status.
            const novoStatus = requisicao.question(`Qual o novo status para a reserva ${reservaParaMudar.id_reserva}? (Ex: Confirmada, Finalizada): `);

            // ETAPA 5: Atualizar o status.
            reservaParaMudar.status = novoStatus;

            console.log(`\nStatus da reserva ${reservaParaMudar.id_reserva} alterado para '${novoStatus}' com sucesso!`);

        } else {
            console.log('\nOpção inválida. Por favor, tente novamente.');
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
                                requisicao.question("Pressione ENTER para continuar: ")
                                break;

                            //listar os quartos disponiveis, com a opção de clicar para ver os seus detalhes
                            case "2":
                                sistema.listarQuartosDetalhes();
                                break;

                            case "3":
                                sistema.listarQuartosReserva(usuarioLogado);
                                break;

                            case "4":
                                sistema.cancelarReserva(usuarioLogado);
                                break;

                            case "5":
                                sistema.listarReservasCliente(usuarioLogado);
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
                        console.log("7: Sair da Área do funcionário")
                        const numeroÁreaFuncioario = requisicao.question("Opcao escolhida: ");

                        switch (numeroÁreaFuncioario) {

                            case "1":
                                console.log("\n" + "=".repeat(40));
                                console.log(`${usuarioLogado.nome}`);
                                console.log(`${usuarioLogado.email}`);
                                requisicao.question("Pressione ENTER para continuar: ")
                                break;

                            case "2":
                                sistema.listarReservas();
                                break;

                            case "3":
                                sistema.listarQuartosDetalhes();
                                break;
                            case "4":
                                sistema.listarClientes();
                                break;

                            case "5":
                                sistema.mudarStatusReserva();
                                break

                            case "7":
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
