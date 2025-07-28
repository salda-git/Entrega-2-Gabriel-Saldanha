const requisicao = require('readline-sync')
const path = require('path');
const fs = require('fs')
console.clear()
//definir as características do login

class Usuario {
    // A ordem oficial é definida aqui: id, nome, cpf, email, senha
    constructor(id, nome, cpf, email, senha, dataNascimento) {
        this.id = id;
        this.nome = nome;
        this.cpf = cpf;
        this.email = email;
        this.senha = senha;
        this.dataNascimento = dataNascimento;
    }
}

class Cliente extends Usuario {
    constructor(id, nome, cpf, email, senha, dataNascimento) {
        super(id, nome, cpf, email, senha, dataNascimento);
    }
}

class Funcionario extends Usuario {
    constructor(id, nome, cpf, email, senha, dataNascimento) {
        super(id, nome, cpf, email, senha, dataNascimento);
    }
}

class Quartos {
    constructor(tipoDeQuarto, camas, preco, quantidade, descricao) {
        this.tipoDeQuarto = tipoDeQuarto;
        this.camas = camas;
        this.preco = preco;
        this.quantidade = quantidade;
        this.descricao = descricao;
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
        this.avaliacao = { nota: null, comentario: null };
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
        const cpf = requisicao.question("CPF: ");
        const nascimento = requisicao.question("Data de nascimento: DD/MM/AAAA: ");

        if (tipoDeCadastro === "1") {
            if (this.clientes.find(c => c.email === email)) {
                console.log("\nErro: E-mail de cliente já cadastrado.");
                return;
            }
            // A chamada new Cliente() passa os valores na MESMA ORDEM: (id, nome, cpf, email, senha)
            // Como não pedimos o CPF, passamos 'null'.
            const novoCliente = new Cliente(this.proximoIdCliente, nome, cpf, email, senha, nascimento);
            this.clientes.push(novoCliente);
            this.proximoIdCliente += 1;
            console.log("\nCadastro de cliente realizado com sucesso!");
            this.salvarClientes();

        } else if (tipoDeCadastro === "2") {
            if (this.funcionarios.find(f => f.email === email)) {
                console.log("\nErro: E-mail de funcionário já cadastrado.");
                return;
            }
            // A chamada new Funcionario() também passa os valores na MESMA ORDEM.
            const novoFuncionario = new Funcionario(this.proximoIdFuncionario, nome, cpf, email, senha, nascimento);
            this.funcionarios.push(novoFuncionario);
            this.proximoIdFuncionario += 1;
            console.log("\nCadastro de funcionário realizado com sucesso!");
            requisicao.question("Pressione ENTER para continuar");
            this.salvarFuncionarios()
        } else {
            console.log("\nOpção de cadastro inválida.");
        }
        requisicao.question("Pressione ENTER para continuar")
        console.clear()
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
            requisicao.question("Pressione ENTER para continuar")
            console.clear()
            return buscarUsuario;
        } else {
            console.log("\nUsuário não encontrado.");
            requisicao.question("Pressione ENTER para continuar")
            console.clear()
            return null
        }

    }

    mudarDados(usuarioLogado) {
        console.clear()
        let sair = false;
        while (!sair) {
            console.log('\n--- Meus Dados ---');
            console.log(`Nome: ${usuarioLogado.nome}`);
            console.log(`Email: ${usuarioLogado.email}`);
            console.log(`CPF: ${usuarioLogado.cpf}`);
            console.log(`Data de nascimento: ${usuarioLogado.dataNascimento}`);
            console.log('-'.repeat(20));
            console.log('O que você deseja alterar?');
            console.log('1: Mudar Nome');
            console.log('2: Mudar Email');
            console.log('3: Mudar Senha');
            console.log(`4: Mudar CPF `)
            console.log(`5: Mudar data de nascimento`)
            console.log('6: Voltar');

            const escolha = requisicao.question('Opcao escolhida: ');
            console.clear()

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
                case '4': {
                    const novoCpf = requisicao.question('Digite o novo CPF: ');
                    usuarioLogado.cpf = novoCpf;
                    console.log('\nCPF alterado com sucesso!');
                    break;
                }
                case '5': {
                    const novaData = requisicao.question('Digite a nova data de nascimento: ');
                    usuarioLogado.dataNascimento = novaData;
                    console.log('\nData de nascimento alterada com sucesso!');
                    break;
                }
                case '6':
                    sair = true;
                    break;
                default:
                    console.log('\nOpção inválida.');
                    break;
            }
            if (!sair) requisicao.question("\nPressione ENTER para continuar...");
            console.clear()
        }
    }
    //---------------funções cliente----------------

    listarQuartosDetalhes() {
        console.clear()
        let x = 1
        for (const quarto of this.quartos) {
            console.log(`${x}: ${quarto.tipoDeQuarto}`)
            x += 1;
        }
        let voltar = x
        console.log(`${voltar}: voltar para Àrea do Cliente`);
        const numeroListaQuartos = requisicao.question("Digite o numero do quarto para ver os detalhes ou para voltar:")
        console.clear();
        const valor = parseInt(numeroListaQuartos);

        if (valor == voltar) {
            return
        }

        if (valor > 0 && valor < voltar) {
            const indiceQuarto = valor - 1;
            const quartoSelecionado = this.quartos[indiceQuarto];

            console.log(`Nome: ${quartoSelecionado.tipoDeQuarto}`);
            console.log(`Camas: ${quartoSelecionado.camas}`);
            console.log(`Diária: ${quartoSelecionado.preco}`);
            console.log(`Disponibilidade: ${quartoSelecionado.quantidade}`);
            console.log(`Descrição: ${quartoSelecionado.descricao}`);

            requisicao.question("Pressione ENTER para continuar: ");
            console.clear()
        } else {
            requisicao.question("Pressione ENTER para continuar: ");
            console.clear()
            console.log('Opção inválida')
        }
    }

    fazerReserva(tipoDeQuarto, id_cliente, checkin, checkout) {
        const tipoDeQuartoInfo = this.quartos.find(q => q.tipoDeQuarto === tipoDeQuarto);
        if (!tipoDeQuartoInfo) {
            console.log(`\nErro: O tipo de quarto '${tipoDeQuarto}' não existe.`);
            return;
        }

        const dataCheckinDesejada = this._converterData(checkin);
        const dataCheckoutDesejada = this._converterData(checkout);

        if (!dataCheckinDesejada || !dataCheckoutDesejada) {
            console.log('\nErro: Formato de data inválido. Use DD/MM/AAAA.');
            return;
        }

        if (dataCheckinDesejada >= dataCheckoutDesejada) {
            console.log('\nErro: A data de check-out deve ser posterior à data de check-in.');
            return;
        }

        // Filtra para encontrar as reservas ATIVAS que conflitam com o período desejado
        const reservasConflitantes = this.reservas.filter(reserva => {
            // Ignora reservas que são de outro tipo de quarto
            if (reserva.tipoDeQuarto !== tipoDeQuarto) {
                return false;
            }

            // CORREÇÃO: Ignora reservas que NÃO estão ativas (Cancelada ou Finalizada)
            const statusAtivo = reserva.status.toLowerCase() === 'pendente' || reserva.status.toLowerCase() === 'confirmada';
            if (!statusAtivo) {
                return false;
            }

            const dataCheckinExistente = this._converterData(reserva.checkin);
            const dataCheckoutExistente = this._converterData(reserva.checkout);

            // A fórmula para verificar sobreposição de datas está correta.
            return dataCheckinDesejada < dataCheckoutExistente && dataCheckoutDesejada > dataCheckinExistente;
        });

        // A verificação de disponibilidade está correta.
        if (reservasConflitantes.length >= tipoDeQuartoInfo.quantidade) {
            console.log(`\nDesculpe, não há quartos do tipo '${tipoDeQuarto}' disponíveis para o período de ${checkin} a ${checkout}.`);
            return;
        }

        const novaReserva = new Reserva(this.proximoIdReserva, id_cliente, tipoDeQuarto, checkin, checkout, 'Pendente');
        this.reservas.push(novaReserva);
        this.proximoIdReserva++;
        console.log(`\nReserva para o quarto '${tipoDeQuarto}' de ${checkin} a ${checkout} realizada com sucesso!`);
        this.salvarReservas();
        return novaReserva;
    }

    cancelarReserva(usuarioLogado) {
        console.clear()
        console.log('\n--- Cancelar Reserva ---');

        // Filtra para obter apenas as reservas pendentes do usuário logado.
        const reservasDoCliente = this.reservas.filter(reserva =>
            reserva.id === usuarioLogado.id && reserva.status.toLowerCase() === 'pendente'
        );

        if (reservasDoCliente.length === 0) {
            console.log('Você não possui nenhuma reserva pendente para cancelar.');
            return;
        }

        // Lista as reservas que podem ser canceladas.
        console.log('Suas Reservas Pendentes:');
        let x = 1;
        for (const reserva of reservasDoCliente) {
            console.log(`${x}: Quarto: ${reserva.tipoDeQuarto} | Check-in: ${reserva.checkin}`);
            x++;
        }

        const voltar = x;
        console.log(`${voltar}: Voltar`);

        // Pede ao usuário para escolher qual reserva cancelar.
        const escolha = requisicao.question("\nQual reserva (pelo numero) deseja cancelar? ");
        const valorEscolha = parseInt(escolha);

        if (valorEscolha === voltar) {
            return;
        }

        // Valida a escolha e altera o status.
        if (valorEscolha > 0 && valorEscolha < voltar) {
            const indiceDaReserva = valorEscolha - 1;
            const reservaParaCancelar = reservasDoCliente[indiceDaReserva];

            reservaParaCancelar.status = "Cancelada";

            console.log(`\nReserva para o quarto '${reservaParaCancelar.tipoDeQuarto}' foi cancelada com sucesso!`);

            // Garante que a alteração seja salva no arquivo.
            this.salvarReservas();

        } else {
            console.log('\nOpção inválida.');
        }
    }

    listarReservasCliente(usuarioLogado) {
        console.clear()
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
        console.clear()
        console.log('\n--- Avaliar Estadia ---');

        // 1. Filtra apenas as reservas do cliente que estão "Finalizadas" e ainda não foram avaliadas
        const estadiasParaAvaliar = this.reservas.filter(reserva =>
            reserva.id === usuarioLogado.id &&
            reserva.status === 'Finalizada' &&
            reserva.avaliacao.nota === null
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
    adicionarQuarto() {
        console.clear()
        console.log('\n--- Adicionar Novo Quarto ---');

        const tipoDeQuarto = requisicao.question('Qual o tipo do quarto (ex: Suite Luxo)? ');
        const camas = requisicao.question('Quantidade de camas: ');
        const preco = requisicao.question('Preco da diaria (ex: 150.50): ');
        const quantidade = requisicao.question('Quantidade de quartos deste tipo: ');
        const descricao = requisicao.question('Descrição: ');


        const camasNum = parseInt(camas);
        const precoNum = parseFloat(preco);
        const quantidadeNum = parseInt(quantidade);

        if (tipoDeQuarto && !isNaN(camasNum) && !isNaN(precoNum) && !isNaN(quantidadeNum)) {

            const novoQuarto = new Quartos(tipoDeQuarto, camasNum, precoNum, quantidadeNum, descricao);
            this.quartos.push(novoQuarto);
            console.log(`\nQuarto '${novoQuarto.tipoDeQuarto}' adicionado com sucesso!`);
            console.clear()

            this.salvarQuartos();
            return novoQuarto;

        } else {
            console.log('\nDados inválidos. Operação de adicionar quarto foi cancelada.');
            return null;
        }
    }

    listarQuartosReserva(usuarioLogado) {
        console.clear()
        let x = 1;
        for (const quarto of this.quartos) {
            console.log(`${x}: ${quarto.tipoDeQuarto}`);
            x += 1;
        }

        let voltar = x;
        console.log(`${voltar}: voltar para Área do Cliente`);
        const numeroListaQuartos = requisicao.question("Qual quarto deseja reservar?: ");
        console.clear();
        const valor = parseInt(numeroListaQuartos);

        if (valor == voltar) {
            return;
        }

        if (valor > 0 && valor < voltar) {
            const indiceQuarto = valor - 1;
            const quartoSelecionado = this.quartos[indiceQuarto];

            console.log('Qual a data de entrada e saída?');
            console.log("Use o padrão DD/MM/AAAA");

            // INÍCIO DA VALIDAÇÃO DE CHECK-IN
            let checkin;
            while (true) {
                const inputData = requisicao.question("Checkin (DD/MM/AAAA): ");
                const regex = /^\d{2}\/\d{2}\/\d{4}$/; // Verifica o formato

                if (!regex.test(inputData)) {
                    console.log("Formato inválido. Por favor, use DD/MM/AAAA.");
                    continue;
                }

                const [dia, mes, ano] = inputData.split('/').map(Number);
                const data = new Date(ano, mes - 1, dia);

                // Verifica se a data é real (ex: 30/02 não é válido)
                if (data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia) {
                    checkin = inputData; // Guarda a data válida
                    break; // Sai do loop
                } else {
                    console.log("Data inválida. O dia ou mês não existe.");
                }
            }
            // FIM DA VALIDAÇÃO DE CHECK-IN


            // INÍCIO DA VALIDAÇÃO DE CHECK-OUT
            let checkout;
            while (true) {
                const inputData = requisicao.question("Checkout (DD/MM/AAAA): ");
                const regex = /^\d{2}\/\d{2}\/\d{4}$/;

                if (!regex.test(inputData)) {
                    console.log("Formato inválido. Por favor, use DD/MM/AAAA.");
                    continue;
                }

                const [dia, mes, ano] = inputData.split('/').map(Number);
                const data = new Date(ano, mes - 1, dia);

                if (data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia) {
                    checkout = inputData; // Guarda a data válida
                    break; // Sai do loop
                } else {
                    console.log("Data inválida. O dia ou mês não existe.");
                }
            }
            // FIM DA VALIDAÇÃO DE CHECK-OUT

            // Chama a função de reserva com as datas já validadas
            this.fazerReserva(quartoSelecionado.tipoDeQuarto, usuarioLogado.id, checkin, checkout);

        } else {
            console.log('Opção inválida');
        }
    }

    listarReservas() {
        console.clear()
        console.log('\n--- Lista de Todas as Reservas ---');

        if (this.reservas.length === 0) {
            console.log('Nenhuma reserva foi feita');
            return false;
        }

        let x = 1
        for (const reserva of this.reservas) {
            console.log(`ID da reserva: ${reserva.id_reserva} |ID do cliente: ${reserva.id_cliente} | ${reserva.tipoDeQuarto} | Checkin: ${reserva.checkin} | Checkout: ${reserva.checkout}| Status: ${reserva.status}`)
            x += 1;
        }
        requisicao.question("Pressione ENTER para continuar")
        console.clear()
        return true
    }

    listarClientes() {
        console.clear()
        let x = 1
        for (const cliente of this.clientes) {
            console.log(`ID: ${cliente.id} | Nome: ${cliente.nome} | Email: ${cliente.email} | CPF: ${cliente.cpf} `)
            x += 1;
        }
        requisicao.question("Pressione ENTER para continuar")
        console.clear()
    }

    mudarStatusReserva() {
        console.clear()
        console.log('\n--- Alterar Status da Reserva ---');
        const haReservas = this.listarReservas();

        if (!haReservas) {
            return;
        }

        const escolhaReserva = requisicao.question('\nDigite o ID da reserva que deseja alterar: ');
        const indice = parseInt(escolhaReserva) - 1;
        console.clear()

        // ETAPA 3: Validar a escolha do funcionário.
        if (indice >= 0 && indice < this.reservas.length) {
            const reservaParaMudar = this.reservas[indice];

            // ETAPA 4: Pedir o novo status.
            const novoStatus = requisicao.question(`Qual o novo status para a reserva ${reservaParaMudar.id_reserva}? (Ex: Confirmada, Finalizada, Cancelada): `);
            console.clear()
            // ETAPA 5: Atualizar o status.
            reservaParaMudar.status = novoStatus;

            console.log(`\nStatus da reserva ${reservaParaMudar.id_reserva} alterado para '${novoStatus}' com sucesso!`);
            requisicao.question("Pressione ENTER para continuar");
            console.clear()
            this.salvarReservas();
        } else {
            console.log('\nOpção inválida. Por favor, tente novamente.');
        }
    }

    verAvaliacoes() {
        console.clear()
        console.log('\n--- Avaliações das Estadias ---');

        // Filtra as reservas que têm uma nota de avaliação.
        const reservasAvaliadas = this.reservas.filter(reserva => reserva.avaliacao && reserva.avaliacao.nota !== null);

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
        requisicao.require("Pressione ENTER para continuar")
    }

    editarQuarto() {
        console.clear()
        console.log('\n--- Editar Quarto ---');

        // Listar e selecionar o quarto
        if (this.quartos.length === 0) {
            console.log('Nenhum tipo de quarto cadastrado para editar.');
            return;
        }

        console.log('Qual quarto você deseja editar?');
        this.quartos.forEach((quarto, index) => {
            console.log(`${index + 1}: ${quarto.tipoDeQuarto}`);
        });

        const voltar = this.quartos.length + 1;
        console.log(`${voltar}: Voltar`);

        const escolha = parseInt(requisicao.question('\nDigite o numero do quarto: '));
        console.clear();
        if (escolha === voltar) {
            return;
        }

        // Se a escolha for válida, entrar no menu de edição
        if (escolha > 0 && escolha <= this.quartos.length) {
            const indice = escolha - 1;
            const quartoParaEditar = this.quartos[indice];

            let sairDoMenuEdicao = false;
            while (!sairDoMenuEdicao) {
                // Mostra os dados atuais do quarto e o sub-menu de edição
                console.log('\n--- Editando Quarto ---');
                console.log(`Tipo: ${quartoParaEditar.tipoDeQuarto}`);
                console.log(`Camas: ${quartoParaEditar.camas}`);
                console.log(`Preço: R$ ${quartoParaEditar.preco.toFixed(2)}`);
                console.log(`Quantidade Total: ${quartoParaEditar.quantidade}`);
                console.log(`Descrição Atual: ${quartoParaEditar.descricao}`);
                console.log('-'.repeat(25));
                console.log('O que você deseja alterar?');
                console.log('1: Alterar Tipo');
                console.log('2: Alterar Número de Camas');
                console.log('3: Alterar Preço da Diária');
                console.log('4: Alterar Quantidade Total');
                console.log('5: Alterar a descrição');
                console.log('6: Salvar e Voltar');

                const escolhaEdicao = requisicao.question('Opcao escolhida: ');
                console.clear();

                switch (escolhaEdicao) {
                    case '1':
                        const novoTipo = requisicao.question('Digite o novo tipo do quarto: ');
                        quartoParaEditar.tipoDeQuarto = novoTipo;
                        console.log('Tipo alterado!');
                        break;
                    case '2':
                        const novasCamas = parseInt(requisicao.question('Digite o novo número de camas: '));
                        if (!isNaN(novasCamas) && novasCamas > 0) {
                            quartoParaEditar.camas = novasCamas;
                            console.log('Número de camas alterado!'); requisicao.question("\nPressione ENTER para continuar...");
                        } else {
                            console.log('Valor inválido.');
                        }
                        break;
                    case '3':
                        const novoPreco = parseFloat(requisicao.question('Digite o novo preço da diária: '));
                        if (!isNaN(novoPreco) && novoPreco >= 0) {
                            quartoParaEditar.preco = novoPreco;
                            console.log('Preço alterado!'); requisicao.question("\nPressione ENTER para continuar...");
                        } else {
                            console.log('Valor inválido.');
                        }
                        break;
                    case '4':
                        const novaQuantidade = parseInt(requisicao.question('Digite a nova quantidade total: '));
                        if (!isNaN(novaQuantidade) && novaQuantidade >= 0) {
                            quartoParaEditar.quantidade = novaQuantidade;
                            console.log('Quantidade alterada!');
                        } else {
                            console.log('Valor inválido.'); requisicao.question("\nPressione ENTER para continuar...");
                        }
                        break;
                    case '5':
                        const novaDescrição = requisicao.question("Digite a nova descrição: ");
                        quartoParaEditar.descricao = novaDescrição;
                        console.log("Descrição alterada com sucesso!")
                        requisicao.question("\nPressione ENTER para continuar...");

                    case '6':
                        this.salvarQuartos();
                        console.log('\nAlterações salvas com sucesso!');
                        sairDoMenuEdicao = true;
                        break;
                    default:
                        console.log('\nOpção inválida.');
                }
                if (!sairDoMenuEdicao) requisicao.question("\nPressione ENTER para continuar...");
                console.clear();
            }
        } else {
            console.log('\nOpção de quarto inválida.');
        }
    }

    excluirQuarto() {
        console.log('\n--- Excluir Quarto ---');

        if (this.quartos.length === 0) {
            console.log('Nenhum tipo de quarto cadastrado para excluir.');
            return;
        }

        console.log('Qual quarto você deseja excluir?');
        this.quartos.forEach((quarto, index) => {
            console.log(`${index + 1}: ${quarto.tipoDeQuarto}`);
        });

        const voltar = this.quartos.length + 1;
        console.log(`${voltar}: Voltar`);

        const escolha = parseInt(requisicao.question('\nDigite o numero do quarto: '));
        console.clear();

        if (escolha === voltar) {
            return;
        }

        if (escolha > 0 && escolha <= this.quartos.length) {
            const indice = escolha - 1;
            const quartoParaExcluir = this.quartos[indice];

            const temReservasAtivas = this.reservas.some(reserva =>
                reserva.tipoDeQuarto === quartoParaExcluir.tipoDeQuarto &&
                reserva.status.toLowerCase() !== 'finalizada' &&
                reserva.status.toLowerCase() !== 'cancelada'
            );

            if (temReservasAtivas) {
                console.log(`\nERRO: Não é possível excluir o quarto '${quartoParaExcluir.tipoDeQuarto}' pois existem reservas ativas ou pendentes para ele.`);
                return;
            }

            const confirmacao = requisicao.question(`Tem certeza que deseja excluir o quarto '${quartoParaExcluir.tipoDeQuarto}'? Esta ação não pode ser desfeita. (S/N): `);

            if (confirmacao.toUpperCase() === 'S') {
                this.quartos.splice(indice, 1);

                this.salvarQuartos();

                console.log(`\nQuarto '${quartoParaExcluir.tipoDeQuarto}' excluído com sucesso!`);
                requisicao.question("Pressione ENTER para continuar:")
                console.clear();
            } else {
                console.log('\nOperação de exclusão cancelada.');
            }
        } else {
            console.log('\nOpção de quarto inválida.');
        }
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
            if (obj.id >= this.proximoIdCliente) {
                this.proximoIdCliente = obj.id + 1;
            }
        });

        // --- Carregar Funcionários ---
        const funcionariosArray = this._carregarDados('funcionarios.json');
        funcionariosArray.forEach(obj => {
            const funcionario = new Funcionario(obj.id, obj.nome, obj.cpf, obj.email, obj.senha);
            this.funcionarios.push(funcionario);
            if (obj.id >= this.proximoIdFuncionario) {
                this.proximoIdFuncionario = obj.id + 1;
            }
        });

        // --- Carregar Reservas ---
        const reservasArray = this._carregarDados('reservas.json');

        reservasArray.forEach(obj => {
            const reserva = new Reserva(obj.id_reserva, obj.id, obj.tipoDeQuarto, obj.checkin, obj.checkout, obj.status);

            if (obj.avaliacao) {
                reserva.avaliacao = obj.avaliacao;
            }

            this.reservas.push(reserva);

            // Atualizamos o próximo ID para evitar colisões
            if (obj.id_reserva >= this.proximoIdReserva) {
                this.proximoIdReserva = obj.id_reserva + 1;
            }
        });

        // --- Carregar Quartos ---
        const quartosArray = this._carregarDados('quartos.json');
        quartosArray.forEach(obj => {
            // Lembre-se de usar 'preco' sem acento se você já padronizou na classe Quartos
            const quarto = new Quartos(obj.tipoDeQuarto, obj.camas, obj.preco, obj.quantidade);
            this.quartos.push(quarto);
        });

        console.log('Dados carregados com sucesso!');
    }

    //---------funções auxiliares----------
    _converterData(stringData) {
        if (!stringData || typeof stringData !== 'string') return null;
        const partes = stringData.split('/');
        if (partes.length !== 3) return null;

        const [dia, mes, ano] = partes.map(Number);
        if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return null;

        const data = new Date(ano, mes - 1, dia);
        // Validação extra para datas inválidas como 31/02
        if (data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia) {
            return data;
        }
        return null;
    }

}
const sistema = new Sistema;


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
            console.clear();
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
                        console.log("7: Alterar dados")
                        console.log("8: Voltar ao Menu Pricipal");
                        const numeroÁreaCLiente = requisicao.question("Opcao escolhida: \n");

                        switch (numeroÁreaCLiente) {

                            case "1":
                                console.clear();
                                console.log("\n" + "=".repeat(40));
                                console.log(`Nome: ${usuarioLogado.nome}`);
                                console.log(`E-mail: ${usuarioLogado.email}`);
                                console.log(`CPF: ${usuarioLogado.cpf}`);
                                console.log(`Data de nascimento: ${usuarioLogado.dataNascimento}`);
                                requisicao.question("Pressione ENTER para continuar: ")
                                break;

                            //listar os quartos disponiveis, com a opção de clicar para ver os seus detalhes
                            case "2": console.clear(); sistema.listarQuartosDetalhes(); break;
                            case "3": console.clear(); sistema.listarQuartosReserva(usuarioLogado); break;
                            case "4": console.clear(); sistema.cancelarReserva(usuarioLogado); break;
                            case "5": console.clear(); sistema.listarReservasCliente(usuarioLogado); break;
                            case "6": console.clear(); sistema.avaliarEstadia(usuarioLogado); break;
                            case "7": console.clear(); sistema.mudarDados(usuarioLogado); break;
                            case "8": sairDaAreaDoCliente = true; console.clear(); break;

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
                        console.log("8: Mudar dados");
                        console.log("9: Editar quarto")
                        console.log("10: Excluir quarto")
                        console.log("11: Sair da Área do funcionário")
                        const numeroÁreaFuncioario = requisicao.question("Opcao escolhida: ");

                        switch (numeroÁreaFuncioario) {

                            case "1":
                                console.clear();
                                console.log("\n" + "=".repeat(40));
                                console.log(`Nome: ${usuarioLogado.nome}`);
                                console.log(`E-mail: ${usuarioLogado.email}`);
                                console.log(`CPF: ${usuarioLogado.cpf}`);
                                console.log(`Data de nascimento: ${usuarioLogado.dataNascimento}`);
                                requisicao.question("Pressione ENTER para continuar: ")
                                break;

                            case "2": console.clear(); sistema.listarReservas(); break;
                            case "3": console.clear(); sistema.listarQuartosDetalhes(); break;
                            case "4": console.clear(); sistema.listarClientes(); break;
                            case "5": console.clear(); sistema.mudarStatusReserva(); break;
                            case "6": console.clear(); sistema.adicionarQuarto(); break;
                            case "7": console.clear(); sistema.verAvaliacoes(); break;
                            case "8": console.clear(); sistema.mudarDados(usuarioLogado); break;
                            case "9": console.clear(); sistema.editarQuarto(); break;
                            case "10": console.clear(); sistema.excluirQuarto(); break;
                            case "11": sairDaAreaDoFuncionário = true; console.clear(); break;
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
