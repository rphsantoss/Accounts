const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')

operation()

function operation() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'O que você deseja fazer?',
            choices: ['Criar conta', 'Consultar saldo', 'Depositar', 'Sacar', 'Sair'],
        },
    ]).then(answer => {

        const action = answer['action']
        
        if(action === 'Criar conta') {
            createAccount()

        } else if (action === 'Consultar saldo') {

        } else if (action === 'Depositar') {
            deposit()

        } else if (action === 'Sacar') {

        } else if (action === 'Sair') {
            console.log(chalk.bgBlue.black("Obrigado por usar o Accounts!"))
            process.exit()
        }

    }).catch(err => console.log(err))
}

//create an account

function createAccount() {
    console.log(chalk.bgGreen.black('Obrigado por escolher o nosso banco!'))
    console.log(chalk.green('Defina as opções a seguir:'))

    buildAccount()
}

function buildAccount() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual será o nome da sua conta? '

        }    
    ]).then(answer => {

        const accountName = answer['accountName']
        console.info(accountName)

        if(!fs.existsSync('accounts')) {
            fs.mkdirSync('accounts')
        }

        if(fs.existsSync(`accounts/${accountName}.json`)) {
            console.log(chalk.bgRed.black('Este nome de conta já existe, escolha outro!'))

            buildAccount()
            return
        }

        fs.writeFileSync(`accounts/${accountName}.json`, '{balance": 0}', function(err){
            console.log(err)
        })

        console.log(chalk.green('Parabéns, a sua conta foi criada!'))
        operation()

    }).catch((err) => console.log(err))
}

// add an amount to user account
function deposit() {
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Qual o nome da sua conta?'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        //verify if account exists
        if(!checkAccount(accountName)) {
            return deposit()
        }
        
        inquirer.prompt([
            {
                name: 'amount',
                message: 'Quanto você deseja depositar?'
            },
        ]).then((answer) => {

            const amount = answer['amount']

            //add amount
            addAmount(accountName, account)
            operation()

        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

function checkAccount(accountName) {

    if(!fs.existsSync(`accounts/${accountName}.json`)) {
        console.log(chalk.bgRed.black('Esta conta não existe, escolha outra ou crie uma'))
        return false
    } 
    return true
}

function addAmount(accountName, account) {

    const account = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )

    console.log(chalk.green(`Foi depositado o valor de R$${amount} na sua conta`))
    operation()
}

function getAccount(accountName) {
    const accountJSON = fs.readFileSync(`accounts/${accountName}.json`,
    {
        encoding: 'utf8',
        flag: 'r',
    })

    return JSON.parse(accountJSON)
}