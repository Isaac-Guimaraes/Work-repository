const { select, input, checkbox } = require('@inquirer/prompts')

let meta = {
    value: 'Tomar 3L de água',
    checked: false,
}

let metas = [ meta ]

const CadastrarMeta = async() => {
    const meta = await input({message: 'Digite sua meta: '})

    if(meta.length == 0) {
        console.log('A meta não pode ser vazia')
        return
    }

    metas.push(
        { value: meta, checked: false}
    )

}

const MetasRealizadas = async() => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    })

    if(realizadas.length == 0) {
        console.log('Não existem metas realizadas! :(')
        return
    }

    await select({
        message: 'Metas realizadas' + realizadas.length,
        choices: [...realizadas]
    })
}

const MetasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    })

    if(abertas.length == 0) {
        console.log('Não existem metas abertas" :)')
        return
    }

    await select({
        message: 'Metas abertas' + abertas.length,
        choices: [...abertas]
    })
}

const DeletarMetas = async () => {
    const MetasDesmarcadas = metas.map((meta) => {
        return {value: meta.value, checked: false }
    })

    const itensAdeletar = await checkbox({
        message: 'Selecione o item para deletar.',
        choices: [...MetasDesmarcadas],
        instructions: false,
    })

    if(itensAdeletar.length == 0) {
        console.log('Nenhum item selecionado!')
        return
    }

    itensAdeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        }) 
    })

    console.log('Meta(s) deletada(s) com sucesso!')

}

const ListarMetas = async () => {
    const respostas = await checkbox({
        message: 'Use as setas para mudar de meta, o Espaço para marcar ou desmarcar e o Enter para finaçizar essa etapa',
        choices: [...metas],
        instructions: false,
    })

    metas.forEach((m) => {
        m.checked = false
    })

    if(respostas.length == 0) {
        console.log('Nenuma meta selecionada!')
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

const start = async ()  => {

    while(true){

        const opcao = await select({
            message: 'Menu >',
            choices: [
                {
                    nome: 'Cadastrar meta',
                    value: 'cadastrar'
                },
                {
                    nome: 'Listar uma meta',
                    value: 'listar'
                },
                {
                    nome: 'Metas realizadas',
                    value: 'realizadas'
                },
                {
                    nome: 'Metas abertas',
                    value: 'abertas'
                },
                {
                    nome: 'Deletar metas',
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
                console.log(metas)
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