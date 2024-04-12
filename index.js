const inquirer = require('inquirer')
const chalk = require('chalk')

const fs = require('fs')

operation()

function operation() {

    inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'Escolha a operação:',
            choices: ['Criar conta', 'Consultar saldo', 'Depositar', 'Sacar', 'Sair'],
        },
    ]).then(answer => {

        const action = answer['action']
        
        if(action === 'Criar conta') {
            createAccount()

        } else if (action === 'Consultar saldo') {
            getAccountBalance()

        } else if (action === 'Depositar') {
            deposit()

        } else if (action === 'Sacar') {
            withdraw()

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
            message: 'Crie um nome para sua conta:'

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

        fs.writeFileSync(`accounts/${accountName}.json`, '{"balance": 0}', function(err){
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
            message: 'Nome da conta:'
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
                message: 'Indique o valor à depositar:'
            },
        ]).then((answer) => {

            const amount = answer['amount']

            //add amount
            addAmount(accountName, amount)

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

function addAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return deposit()
    }

    accountData.balance = parseFloat(amount) + parseFloat(accountData.balance) // -> adiciona quantia

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
        encoding: 'utf8', //preve acentos
        flag: 'r', //read
    })

    return JSON.parse(accountJSON)
}

function getAccountBalance() {

    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Nome da conta:'
        }
    ]).then((answer) => {

        const accountName = answer["accountName"]

        if(!checkAccount(accountName)) {
            return getAccountBalance()
        }

        const accountData = getAccount(accountName)

        console.log(chalk.bgBlue.black(`O saldo da sua conta é de R$${accountData.balance}`))
        operation()

    }).catch(err => console.log(err))
}

function withdraw() {
    
    inquirer.prompt([
        {
            name: 'accountName',
            message: 'Nome da conta:'
        }
    ]).then((answer) => {

        const accountName = answer['accountName']

        if(!checkAccount(accountName)) {
            return withdraw()
        }

        inquirer.prompt([
            {
                name: 'amount',
                message: 'Indique o valor à sacar:'
            }
        ]).then((answer) => {

            const amount = answer["amount"]
            removeAmount(accountName, amount)   
    
        }).catch(err => console.log(err))

    }).catch(err => console.log(err))
}

function removeAmount(accountName, amount) {

    const accountData = getAccount(accountName)

    if(!amount) {
        console.log(chalk.bgRed.black('Ocorreu um erro, tente novamente mais tarde!'))
        return withdraw()
    }

    if(accountData.balance < amount) {
        console.log(chalk.bgRed.black('Valor indisponível!'))
        return withdraw()
    }

    accountData.balance = parseFloat(accountData.balance) - parseFloat(amount)

    fs.writeFileSync(
        `accounts/${accountName}.json`,
        JSON.stringify(accountData),
        function (err) {
            console.log(err)
        }
    )
    console.log(chalk.green(`Foi realizado um saque de R$${amount} da sua conta!`))

    operation()
}