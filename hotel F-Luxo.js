const requisicao = require('readline-sync')
const path = require('path');
const fs = require('fs')
//definir as características do login

class Usuario {
    // A ordem oficial é definida aqui: id, nome, cpf, email, senha
    constructor(id, nome, cpf, email, senha) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
    }
}

class Cliente extends Usuario {
    constructor(id, nome, cpf, email, senha) {
        super(id, nome, cpf, email, senha);
    }
}

class Funcionario extends Usuario {
    constructor(id, nome, cpf, email, senha) {
        super(id, nome, cpf, email, senha);
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
    constructor(id_reserva, id, tipoDeQuarto, checkin, checkout, status) {
        this.id = id;
        this.tipoDeQuarto = tipoDeQuarto;
        this.status = status;
        this.id_reserva = id_reserva;
        this.checkin = checkin;
        this.checkout = checkout;
        this.avaliacao = null;
    }
}


//definindo a funcionalidades
class Sistema {
    constructor() {
        this.clientes = [];
        this.funcionarios = [];
        this.quartos = [];
        this.reservas = [];

        this.proximoIdCliente = 1;
        this.proximoIdFuncionario = 1;
        this.proximoIdReserva = 1;

        this.diretorioDeDados = 'dados';

        if (!fs.existsSync(this.diretorioDeDados)) {
            fs.mkdirSync(this.diretorioDeDados);
        }

        this.carregarDados();

    }

    //-----------funções pagina inicial ou gerais----------------
    cadastrarUsuario() {
        console.log("\n--- Novo Cadastro ---");
        const tipoDeCadastro = requisicao.question("Qual o tipo do Cadastro?\n1: Cliente \n2: Funcionario\nResposta: ");
        const nome = requisicao.question("Nome: ");
        const email = requisicao.question("Email: ");
        const senha = requisicao.question("Senha: ");

        if (tipoDeCadastro === "1") {
            if (this.clientes.find(c => c.email === email)) {
                console.log("\nErro: E-mail de cliente já cadastrado.");
                return;
            }
            // A chamada new Cliente() passa os valores na MESMA ORDEM: (id, nome, cpf, email, senha)
            // Como não pedimos o CPF, passamos 'null'.
            const novoCliente = new Cliente(this.proximoIdCliente, nome, null, email, senha);
            this.clientes.push(novoCliente);
            this.proximoIdCliente++;
            console.log("\nCadastro de cliente realizado com sucesso!");
            this.salvarClientes();

        } else if (tipoDeCadastro === "2") {
            if (this.funcionarios.find(f => f.email === email)) {
                console.log("\nErro: E-mail de funcionário já cadastrado.");
                return;
            }
            // A chamada new Funcionario() também passa os valores na MESMA ORDEM.
            const novoFuncionario = new Funcionario(this.proximoIdFuncionario, nome, null, email, senha);
            this.funcionarios.push(novoFuncionario);
            this.proximoIdFuncionario++;
            console.log("\nCadastro de funcionário realizado com sucesso!");
            this.salvarFuncionarios()
        } else {
            console.log("\nOpção de cadastro inválida.");
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

    mudarDados(usuarioLogado) {
        let sair = false;
        while (!sair) {
            console.log('\n--- Meus Dados ---');
            console.log(`Nome: ${usuarioLogado.nome}`);
            console.log(`Email: ${usuarioLogado.email}`);
            console.log('-'.repeat(20));
            console.log('O que você deseja alterar?');
            console.log('1: Mudar Nome');
            console.log('2: Mudar Email');
            console.log('3: Mudar Senha');
            console.log('4: Voltar');

            const escolha = requisicao.question('Opcao escolhida: ');

            switch (escolha) {
                case '1': {
                    const novoNome = requisicao.question('Digite o novo nome: ');

                    usuarioLogado.nome = novoNome;
                    console.log('\nNome alterado com sucesso!');
                    break;
                }
                case '2': {
                    const novoEmail = requisicao.question('Digite o novo email: ');
                    usuarioLogado.email = novoEmail;
                    console.log('\nEmail alterado com sucesso!');
                    break;
                }
                case '3': {
                    const novaSenha = requisicao.question('Digite a nova senha: ');
                    usuarioLogado.senha = novaSenha;
                    console.log('\nSenha alterada com sucesso!');
                    break;
                }
                case '4':
                    sair = true;
                    break;
                default:
                    console.log('\nOpção inválida.');
                    break;
            }
            // Pausa para o usuário ver a mensagem de sucesso antes de mostrar o menu de novo
            if (!sair) requisicao.question("\nPressione ENTER para continuar...");
        }
    }
    //---------------funções cliente----------------

    listarQuartosDetalhes() {
        let x = 1
        for (const quarto of this.quartos) {
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
            const quartoSelecionado = this.quartos[indiceQuarto];

            console.log(`Nome: ${quartoSelecionado.tipoDeQuarto}`);
            console.log(`Camas: ${quartoSelecionado.camas}`);
            console.log(`Diária: ${quartoSelecionado.preço}`);
            console.log(`Disponibilidade: ${quartoSelecionado.quantidade}`);
        } else {
            console.log('Opção inválida')
        }
    }

    fazerReserva(tipoDeQuarto, id, checkin, checkout) {
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
            const novaReserva = new Reserva(this.proximoID_reserva, id, tipoDeQuarto, checkin, checkout, 'pendente')


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
            if (reserva.id === usuarioLogado.id) {
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
            if (reserva.id == usuarioLogado.id) {
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

            reservaParaCancelar.status = "Cancelada"

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
            if (reserva.id === usuarioLogado.id) {
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


    avaliarEstadia(usuarioLogado) {
        console.log('\n--- Avaliar Estadia ---');

        // 1. Filtra apenas as reservas do cliente que estão "Finalizadas" e ainda não foram avaliadas
        const estadiasParaAvaliar = this.reservas.filter(reserva =>
            reserva.id === usuarioLogado.id &&
            reserva.status === 'Finalizada' &&
            reserva.avaliacao === null
        );

        // 2. Verifica se existem estadias elegíveis para avaliação
        if (estadiasParaAvaliar.length === 0) {
            console.log('Você não possui nenhuma estadia finalizada para avaliar no momento.');
            return;
        }

        // 3. Lista as estadias que podem ser avaliadas
        console.log('Qual estadia você gostaria de avaliar?');
        estadiasParaAvaliar.forEach((reserva, index) => {
            console.log(`${index + 1}: Quarto: ${reserva.tipoDeQuarto} | Checkout em: ${reserva.checkout}`);
        });

        const voltar = estadiasParaAvaliar.length + 1;
        console.log(`${voltar}: Voltar`);

        // 4. Pede a escolha do usuário
        const escolha = parseInt(requisicao.question('\nOpcao escolhida: '));

        if (escolha === voltar) return;

        if (escolha > 0 && escolha <= estadiasParaAvaliar.length) {
            const indice = escolha - 1;
            const reservaParaAvaliar = estadiasParaAvaliar[indice];

            // 5. Pede a nota e valida a entrada (só aceita números de 1 a 5)
            let nota = 0;
            while (nota < 1 || nota > 5 || isNaN(nota)) {
                nota = parseInt(requisicao.question(`\nQual sua nota para a estadia no quarto '${reservaParaAvaliar.tipoDeQuarto}' (de 1 a 5)? `));
                if (nota < 1 || nota > 5 || isNaN(nota)) {
                    console.log('Nota inválida. Por favor, digite um número entre 1 e 5.');
                }
            }

            const comentario = requisicao.question('Por favor, deixe um comentário sobre a sua estadia: ');


            // 6. Salva a avaliação na reserva
            reservaParaAvaliar.avaliacao.nota = nota;
            reservaParaAvaliar.avaliacao.comentario = comentario;

            console.log('\nObrigado pela sua avaliação! Seu feedback é muito importante para nós.');

        } else {
            console.log('\nOpção inválida.');
        }
    }

    //---------------funções funcionário---------------
    adicionarQuarto(tipoDeQuarto, camas, diaria, quantidade) {
        const novoQuarto = new Quartos(tipoDeQuarto, camas, diaria, quantidade);
        this.quartos.push(novoQuarto);
        console.log(`${novoQuarto.tipoDeQuarto} adicionado com sucesso!`)
        this.salvarQuartos();
        return novoQuarto;
    }

    listarQuartosReserva(usuarioLogado) {
        let x = 1
        for (const quarto of this.quartos) {
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
            this.fazerReserva(quartoSelecionado.tipoDeQuarto, usuarioLogado.id, checkin, checkout)

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
            console.log(`${x}: ${reserva.id_reserva} | ${reserva.id} | ${reserva.tipoDeQuarto} | ${reserva.checkin}| ${reserva.checkout}| ${reserva.status}`)
            x += 1;
        }
        return true
    }

    listarClientes() {
        let x = 1
        for (const cliente of this.clientes) {
            console.log(`${x}: ${cliente.id} | ${x}: ${cliente.nome} | ${x}: ${cliente.email} | `)
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
            const novoStatus = requisicao.question(`Qual o novo status para a reserva ${reservaParaMudar.id_reserva}? (Ex: Confirmada, Finalizada, Cancelada): `);

            // ETAPA 5: Atualizar o status.
            reservaParaMudar.status = novoStatus;

            console.log(`\nStatus da reserva ${reservaParaMudar.id_reserva} alterado para '${novoStatus}' com sucesso!`);

        } else {
            console.log('\nOpção inválida. Por favor, tente novamente.');
        }
    }

    verAvaliacoes() {
        console.log('\n--- Avaliações das Estadias ---');

        // Filtra as reservas que têm uma nota de avaliação.
        const reservasAvaliadas = this.reservas.filter(reserva => reserva.avaliacao.nota !== null);

        if (reservasAvaliadas.length === 0) {
            console.log('Nenhuma estadia foi avaliada ainda.');
            return;
        }

        // Lista cada avaliação
        console.log('Avaliações recebidas:');
        reservasAvaliadas.forEach(reserva => {
            console.log(`\n- Quarto: ${reserva.tipoDeQuarto}`);
            console.log(`  Nota: ${reserva.avaliacao.nota} de 5`);
            console.log(`  Comentário: "${reserva.avaliacao.comentario}"`);
        });

        // Calcula a média geral das notas.
        const somaDasNotas = reservasAvaliadas.reduce((total, reserva) => total + reserva.avaliacao.nota, 0);
        const media = somaDasNotas / reservasAvaliadas.length;

        console.log('\n' + '-'.repeat(30));
        console.log(`NOTA MÉDIA GERAL: ${media.toFixed(1)} de 5`);
        console.log('-'.repeat(30));
    }
    //--------------funções para salvar os dados-------------

    _salvarDados(nomeArquivo, dados) {
        try {
            const dadosEmString = JSON.stringify(dados, null, 2);
            require('fs').writeFileSync(nomeArquivo, dadosEmString, 'utf-8');
        } catch (erro) {
            console.error(`Erro ao salvar o arquivo ${nomeArquivo}:`, erro);
        }
    }

    salvarClientes() {
        this._salvarDados('clientes.json', this.clientes);
    }

    salvarFuncionarios() {
        this._salvarDados('funcionarios.json', this.funcionarios);
    }

    salvarReservas() {
        const arrayDeReservas = Array.from(this.reservas.values());
        this._salvarDados('reservas.json', arrayDeReservas);
    }

    salvarQuartos() {
        this._salvarDados('quartos.json', this.quartos);
    }

    _carregarDados(nomeArquivo) {
        try {
            const fs = require('fs');
            if (fs.existsSync(nomeArquivo)) {
                const dadosEmString = fs.readFileSync(nomeArquivo, 'utf-8');
                return JSON.parse(dadosEmString); // Retorna o array de objetos lido do arquivo
            }
            return []; // Se o arquivo não existe, retorna uma lista vazia
        } catch (erro) {
            console.error(`Erro ao carregar o arquivo ${nomeArquivo}:`, erro);
            return []; // Em caso de erro, retorna uma lista vazia para não quebrar o programa
        }
    }

    carregarDados() {
        // --- Carregar Clientes ---
        const clientesArray = this._carregarDados('clientes.json');
        clientesArray.forEach(obj => {
            // Recriamos a instância da classe Cliente
            const cliente = new Cliente(obj.id, obj.nome, obj.cpf, obj.email, obj.senha);
            this.clientes.push(cliente);
            // Atualizamos o próximo ID para evitar colisões
            if (obj.id >= this.proximoID_cliente) {
                this.proximoID_cliente = obj.id + 1;
            }
        });

        // --- Carregar Funcionários ---
        const funcionariosArray = this._carregarDados('funcionarios.json');
        funcionariosArray.forEach(obj => {
            const funcionario = new Funcionario(obj.id, obj.nome, obj.cpf, obj.email, obj.senha);
            this.funcionarios.push(funcionario);
            if (obj.id >= this.proximoID_funcionario) {
                this.proximoID_funcionario = obj.id + 1;
            }
        });

        // --- Carregar Reservas ---
        const reservasArray = this._carregarDados('reservas.json');
        reservasArray.forEach(obj => {
            // Recriamos a instância da classe Reserva
            const reserva = new Reserva(obj.id_reserva, obj.id, obj.tipoDeQuarto, obj.checkin, obj.checkout, obj.status);
            // Atribuímos a avaliação que pode ter sido salva
            reserva.avaliacao = obj.avaliacao;
            this.reservas.push(reserva); // Usaremos array para reservas para simplificar
            if (obj.id_reserva >= this.proximoID_reserva) {
                this.proximoID_reserva = obj.id_reserva + 1;
            }
        });

        console.log('Dados carregados com sucesso!');
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
                    //Menu do cliente 
                    let sairDaAreaDoCliente = false;
                    while (!sairDaAreaDoCliente) {
                        console.log("=".repeat(12) + "Área do Cliente" + "=".repeat(12));
                        console.log("1: Ver Meus Dados");
                        console.log("2: Ver Lista de Quartos");
                        console.log("3: Fazer reserva")
                        console.log("4: Cancelar reserva");
                        console.log("5: Ver minhas reservas");
                        console.log("6: Avaliar estadia");
                        console.log("7: Voltar ao Menu Pricipal");
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
                                sistema.avaliarEstadia(usuarioLogado);
                                break

                            case "7":
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
                        console.log("7: Ver avaliações")
                        console.log("10: Sair da Área do funcionário")
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

                            case "6":
                                sistema.adicionarQuarto();
                                break;

                            case "7":
                                sistema.verAvaliacoes()
                                break

                            case "8":
                                sistema.mudarDados()
                                break

                            case "10":
                                sairDaAreaDoFuncionário = true;
                                break;
                        }

                    }

                }

            }

            break;

        case "2":
            sistema.cadastrarUsuario();
            break;

        case "3":
            sairDoPrograma = true;
            break;
    }
}
