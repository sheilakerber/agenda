//  esconder/mostrar os contatos salvos
function toggleContacts() {
  const contactsData = document.getElementById("contactsTable");
  contactsData.style.display === "none"
    ? (contactsData.style.display = "")
    : (contactsData.style.display = "none");
}

// abrir/fechar o modal de add de novo contato
const ModalAddContato = {
  open() {
    document.querySelector(".modal-overlay-add").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay-add").classList.remove("active");
  },
};

// abrir/fechar o modal de editar contato
const ModalEditContact = {
  open() {
    document.querySelector(".modal-overlay-edit").classList.add("active");
  },
  close() {
    document.querySelector(".modal-overlay-edit").classList.remove("active");
  },
};

// salvando os dados no localStorage
const Storage = {
  // pegando os dados ja salvos
  get() {
    return JSON.parse(localStorage.getItem("storage:savedContacts")) || [];
  },

  // salvando/atualizando dados
  set(contacts) {
    localStorage.setItem("storage:savedContacts", JSON.stringify(contacts));
  },
};

// obj Contato e suas funcionalidades (adicao; edicao; exclusao)
// guardar contatos    >> all == contacts[]
const Contact = {
  all: Storage.get(),

  add(contact) {
    Contact.all.push(contact);
    App.reload();
  },
  remove(index) {
    Contact.all.splice(index, 1);
    App.reload();
  },
  edit(index) {
    ModalEditContact.open();

    const table = document.getElementById("contactsTable");

    App.reload();
  },
};

// adicionando os elementos html da tabela contatos
const DOM = {
  contactsContainer: document.querySelector("#contactsTable tbody"),

  addContact(contact, index) {
    const tr = document.createElement("tr");
    tr.innerHTML = DOM.innerHtmlContact(contact, index);
    tr.dataset.index = index;
    DOM.contactsContainer.appendChild(tr);
  },

  // passando os valores de cada contato para o html
  innerHtmlContact(contact, index) {
    const html = `
      <td class="name">${contact.name}</td>
      <td class="address">${contact.address}</td>
      <td class="phone">${contact.phone}</td>
      <td>
        <button onclick="Contact.edit(${index})"> EDITAR </button>
      </td>
      <td>
        <button onclick="Contact.remove(${index})" >EXCLUIR </button>
      </td>
    `;
    return html;
  },
};

// form de adicao de novo contato
const Form = {
  name: document.querySelector("input#nameAdd"),
  address: document.querySelector("input#addressAdd"),
  phone: document.querySelector("input#phoneAdd"),

  getValues() {
    return {
      name: Form.name.value,
      address: Form.address.value,
      phone: Form.phone.value,
    };
  },

  validateInputs() {
    const { name, address, phone } = Form.getValues();

    if (name.trim() === "" || address.trim() === "" || phone.trim() == "") {
      throw new Error("Por favor, preencha todos os campos.");
    } else {
      return name, address, phone;
    }
  },

  clearInputs() {
    Form.name.value = "";
    Form.address.value = "";
    Form.phone.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateInputs();
      const contact = Form.getValues();
      Contact.add(contact);
      Form.clearInputs();
      ModalAddContato.close();
    } catch (error) {
      alert(error.message);
    }
  },
};

// obj para as funcionalidades de iniciacao e reload da aplicacao
const App = {
  init() {
    Contact.all.forEach((contact, index) => {
      DOM.addContact(contact, index);
    });
    Storage.set(Contact.all);
  },
  reload() {
    DOM.contactsContainer.innerHTML = "";
    App.init();
  },
};

App.init();
