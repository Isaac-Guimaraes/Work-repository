const { select, input } = require('@inquirer/prompts')

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
                console.log('Vamos listar')
                break
            case 'sair':
                console.log('Até logo.')
                return
        }
    }
}

start()