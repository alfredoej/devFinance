// parei na aula 03 - 2:42:00 continuar, codigo atualizado até aqui
// obs: observar porque não deixa colocar o negativo no campo valor do formulario
// gerald do codigo para copiar 2:52:00
const Modal = {
    open(){
        document.querySelector('.modal-overlay').classList.add('active');

    },
    close(){
        document.querySelector('.modal-overlay').classList.remove('active');
    }
}

const Storage = {
    get () {
        return JSON.parse(localStorage.getItem("dev.finance:transactions")) || [];
    },

    set (transactions) {
        localStorage.setItem("dev.finance:transactions",JSON.stringify(transactions));
    }
}
const Transactions = {
    all: Storage.get(),

    add(transaction) {
        Transactions.all.push(transaction);
        App.reload();
    },

    remove(index) {
        Transactions.all.splice(index,1);
        App.reload();
    },
    incomes () {
        let income = 0;
        Transactions.all.forEach(transaction => {
            if (transaction.amount > 0 ){
                income += transaction.amount;
            }
        });

        return income;

    },
    expenses () {
        let expense = 0;
        Transactions.all.forEach(transaction => {
            if (transaction.amount < 0 ){
                expense += transaction.amount;
            }
        });

        return expense;

    },
    total () {
        return Transactions.incomes() + Transactions.expenses();

    }
}

const DOM = {
    transactionsContainer : document.querySelector('#data-table tbody'),

    addTransaction(transaction, index){
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransactions(transaction,index);
        tr.dataset.index = index;


        DOM.transactionsContainer.appendChild(tr);

    },
    innerHTMLTransactions(transaction,index) {
        const CSSClass = transaction.amount > 0 ? "income" : "expense";

        const amount = Utils.formatCurrency(transaction.amount);

        const html = `
            <tr>
            <td class="description">${transaction.description}</td>
            <td class="${CSSClass}">${amount}</td>
            <td class="date"expense>${transaction.date}</td>
            <td><img onclick="Transactions.remove(${index})" src="./assets/minus.svg" alt="Remover transação"></td>
            </tr>
        `

        return html;
    },
    updateBalance () {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Transactions.incomes());
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Transactions.expenses());
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Transactions.total());

            
    },
    clearTransaction (){
        this.transactionsContainer.innerHTML = '';
    }
}

const Utils = {
    
    formatAmount(value){
      value = Number(value) * 100;
      return value;
    },
    formatDate(date){
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },
    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value)/100;

        value = value.toLocaleString("pt-br",{
            style: "currency",
            currency: "BRL"
        });

        return signal + value;
    },

}

const Form = {

    description: document.querySelector("input#description"),
    amount: document.querySelector("input#amount"),
    date: document.querySelector("input#date"), 
    getValues(){
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value

        }


    },
    validateFields(){
        const {description, amount, date} = Form.getValues();
        
        if(description.trim() ==="" ||
        amount.trim() ==="" ||
        date.trim() === ""){
            throw new Error ("Por Favor, Preencha todos os campos");
        };
    },

    formatValues(){
        let {description, amount, date} = Form.getValues();

        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);
        
        return{
            description,
            amount,
            date,
        }
    },
    saveTransaction(transaction) {
        Transactions.add(transaction);
    },
    clearFields(){
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    submit(event){
        event.preventDefault();

        try {
            Form.validateFields();
            const transaction = Form.formatValues();
            Form.saveTransaction (transaction);
            Form.clearFields();
            Modal.close();
     
        } catch (error){
            alert(error.message);
        }
    }
}


const App = {
    init () {
        Transactions.all.forEach (function(transaction,index){
            DOM.addTransaction(transaction,index)
        } );

        
        DOM.updateBalance();

        Storage.set(Transactions.all);
    },

    reload () {
        DOM.clearTransaction();
        App.init();
    }
}

App.init();



