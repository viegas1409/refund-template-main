//seleciona os elementos do formulario
const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

//Selecionar os elementos da lista de despesas
const expenseList = document.querySelector("ul")
const expensesquantity = document.querySelector("aside header p span")
const expensesTotal = document.querySelector("aside header h2")

//Array para armazenar as despesas
let expenses = []

//Carregar despesas do localStorage quando a página abre
function loadExpenses(){
  const saved = localStorage.getItem("expenses")
  if(saved){
    expenses = JSON.parse(saved)
    expenses.forEach(exp => expenseAdd(exp))
  }
}

//Captura o evento de input para formatar o valor
amount.oninput = () => {
  //Obtem o valor atual do input e remove os caracteres nao numericos.
  let value = amount.value.replace(/\D/g, "")

  //Transforma o valor em centavos
  value = Number (value / 100)

  //Atualiza o valor do input
  amount.value = value = formatCurrencyBRL(value)

}

function formatCurrencyBRL(value){
  //Formata o valor no padrao BRL (real brasileiro)
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })

  //Retorna o valor formatado
  return value
}

//captura o evento de submit do formulario
form.onsubmit = (event) => {
  //Previne o comportamento padrao do formulario
  event.preventDefault()

  //Cria um novo objeto de despesa com os valores do formulario
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    creat_at: new Date(),
  }

  //chama a funcao para adicionar a despesa
  expenseAdd(newExpense)
}
//esse metodo adiciona uma nova despesa na lista
function expenseAdd(newExpense){
  try {
   //cria o elemento para adicionar na lista
    const expenseItem = document.createElement("li")
    expenseItem.classList.add("expense")
    expenseItem.setAttribute("data-id", newExpense.id)

    //cria o icone da despesa
    const expenseIcon = document.createElement("img")
    expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`)
    expenseIcon.setAttribute("alt", "newExpense.category_name")

    //Cria a info da despesa
    const expenseInfo = document.createElement("div")
    expenseInfo.classList.add("expense-info")

    //Cria o nome da despesa
    const expenseName = document.createElement("strong")
    expenseName.textContent = newExpense.expense

    //cria a categoria da despesa
    const expenseCategory = document.createElement("span")
    expenseCategory.textContent = newExpense.category_name

    //Adiciona name e categoria na info da despesa
    expenseInfo.appendChild(expenseName)
    expenseInfo.appendChild(expenseCategory)

    //Cria o valor da despesa
    const expenseAmount = document.createElement("span")
    expenseAmount.classList.add("expense-amount")
    expenseAmount.textContent = newExpense.amount

    //cria o icone de remover
    const removeIcon = document.createElement("img")
    removeIcon.classList.add("remove-icon")
    removeIcon.setAttribute("src", "./img/remove.svg")
    removeIcon.setAttribute("alt", "remover")

    //Adiciona as informacoes no item
    expenseItem.appendChild(expenseIcon)
    expenseItem.appendChild(expenseInfo)
    expenseItem.appendChild(expenseAmount)
    expenseItem.appendChild(removeIcon)

    //Adiciona o item na lista
    expenseList.append(expenseItem)

    //adiciona a despesa ao array
    expenses.push(newExpense)

    //salva no localStorage
    localStorage.setItem("expenses", JSON.stringify(expenses))

    //limpa o formulario
    formclear()

    //atualiza os totais
    updatetotals()
    
  }catch (error) {
    alert("nao foi possivel adicionar a despesa.")
    console.log(error)
  }
}

//atualiza a lista de despesas
function updatetotals(){
 try {
   // recupera todos os elementos de despesa na lista
   const items = expenseList.children

   //atualiza a quantidade de despesas
   expensesquantity.textContent = `${items.length} ${items.length > 1 ? 'despesas' : 'despesa'}`

   //variavel para armazenar o total
   let total = 0

   //Percorre todos os itens para calcular o total
   for (let item = 0; item < items.length; item++){
     const itemAmount = items[item].querySelector(".expense-amount").textContent
     let value = itemAmount.replace(/\D/g, "")
     value = Number(value) / 100
     
     if (!isNaN(value)){
       total += value
     }
   }

   //criar a span para adicionar o total formatado
   const symbolBRL = document.createElement("small")
   symbolBRL.textContent = "R$"

   //formata o valor e remove o simbolo de moeda
   const totalFormatted = formatCurrencyBRL(total).replace("R$", "").trim()

   //limpa o conteudo anterior
   expensesTotal.innerHTML = ""

   //adiciona o simbolo e o total formatado
   expensesTotal.appendChild(symbolBRL)
   expensesTotal.appendChild(document.createTextNode(totalFormatted))

 } catch (error) {
   console.log(error)
   alert("Nao foi possivel atualizar os totais.")
 }
}

//evento que captura o clique no icone de remover
expenseList.addEventListener("click", (event) => {
  //verifica se o elemento clicado e o icone de remover
  if (event.target.classList.contains("remove-icon")){
   //obtem o elemento pai (item de despesa)
    const Item = event.target.closest(".expense")

    //remove o item da lista
    Item.remove()
  }

  //atualiza os totais
  updatetotals()
  
})

function formclear(){
  //limpa os valores do formulario
  expense.value = ""
  category.value = ""
  amount.value = ""
//define o foco para o campo de despesa
  expense.focus()

}