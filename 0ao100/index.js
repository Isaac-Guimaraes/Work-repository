const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises
let mensagem =  'Bem-vindo ao app de metas!';

let metas

const CarregarMetas = async () => {
    try{
        const dados = await fs.readFile("metas.json", "utf-8")
        metas = JSON.parse(dados)
    }
    catch(erro) {
        metas = []
    }
}

const SalvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2))
}

const CadastrarMeta = async() => {
    const meta = await input({message: 'Digite sua meta: '})

    if(meta.length == 0) {
        mensagem = 'A meta não pode ser vazia'
        return
    }

    metas.push(
        { value: meta, checked: false}
    )

    mensagem = 'Meta cadastrada com sucesso!'
}

const MetasRealizadas = async() => {

    if(metas.length == 0){
        mensagem = 'Não existem metas!'
        return
    }

    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        mensagem = 'Não existem metas realizadas! :('
        return
    }

    await select({
        message: 'Metas realizadas' + realizadas.length,
        choices: [...realizadas]
    })
}

const MetasAbertas = async () => {

    if(metas.length == 0){
        mensagem = 'Não existem metas!'
        return
    }

    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0) {
        mensagem = 'Não existem metas abertas" :)'
        return
    }

    await select({
        message: 'Metas abertas ' + abertas.length,
        choices: [...abertas]
    })
}

const DeletarMetas = async () => {
    
    if(metas.length == 0){
        mensagem = 'Não existem metas!'
        return
    }

    const MetasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false }
    })

    const itensAdeletar = await checkbox({
        message: 'Selecione o item para deletar.',
        choices: [...MetasDesmarcadas],
        instructions: false,
    })

    if(itensAdeletar.length == 0) {
        mensagem = 'Nenhum item selecionado!'
        return
    }

    itensAdeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        }) 
    })

    mensagem = 'Meta(s) deletada(s) com sucesso!'

}

const ListarMetas = async () => {

    if(metas.length == 0){
        mensagem = 'Não existem metas!'
        return
    }

    const respostas = await checkbox({
        message: 'Use as setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finaçizar essa etapa',
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        mensagem = 'Nenuma meta selecionada!'
        return
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta
    })

    meta.checked = true

})

    console.log('Meta(s) marcada(s) como concluída(s)')

}

const MostrarMensagem = () => {
    console.clear();

    if(mensagem != '') {
        console.log(mensagem)
        console.log('')
        mensagem = ''
    }
}

const start = async ()  => {
    await CarregarMetas()

    while(true){

        MostrarMensagem()
        await SalvarMetas()

        const opcao = await select({
            message: 'Menu >',
            choices: [
                {
                    nome: 'Cadastrar uma meta',
                    value: 'cadastrar'
                },
                {
                    nome: 'Listar metas',
                    value: 'listar'
                },
                {
                    nome: 'Metas realizadas',
                    value: 'realizadas'
                },
                {
                    nome: 'Metas em aberto',
                    value: 'abertas'
                },
                {
                    nome: 'Deletar uma meta',
                    value: 'deletar'
                },
                {
                    name: 'Sair',
                    value: 'sair'
                }
            ]
        })

        switch(opcao) {
            case 'cadastrar':
                await CadastrarMeta()
                break
            case 'listar':
                await ListarMetas()
                break
            case 'realizadas':
                await MetasRealizadas()
                break
            case 'abertas':
                await MetasAbertas()
                break
            case 'deletar':
                await DeletarMetas()
                break
            case 'sair':
                console.log('Até logo.')
                return
        }
    }
}

start()