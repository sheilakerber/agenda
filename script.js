//  esconder/mostrar os contatos salvos
function toggleContacts() {
  const contactsData = document.getElementById("contactsTable");
  if (contactsData.style.display === "none") {
    contactsData.style.display = "";
  } else {
    contactsData.style.display = "none";
  }
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
    const stringContacts = localStorage.getItem("storage:savedContacts");
    if (stringContacts) {
      return JSON.parse(stringContacts);
    } else {
      return [];
    }
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
    Storage.set(Contact.all);
    DOM.reload();
  },
  remove(id) {
    const newContacts = Contact.all.filter((c) => c.id !== id);
    Contact.all = newContacts;
    Storage.set(newContacts);
    DOM.reload();
  },
  edit(id) {
    ModalEditContact.open();
    Contact.currentIdEdit = id;
    const contact = Contact.all.filter((c) => c.id === id);

    document.getElementById("nameEdit").value = contact[0].name;
    document.getElementById("addressEdit").value = contact[0].address;
    document.getElementById("phoneEdit").value = contact[0].phone;
  },
  currentIdEdit: undefined,
};

// adicionando os elementos html da tabela contatos
const DOM = {
  contactsContainer: document.querySelector("#contactsTable tbody"),

  reload() {
    DOM.contactsContainer.innerHTML = "";
    Contact.all.forEach((contact, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = DOM.innerHtmlContact(contact, index);
      tr.dataset.index = index;
      DOM.contactsContainer.appendChild(tr);
    });
  },

  // passando os valores de cada contato para o html
  innerHtmlContact(contact) {
    const html = `
      <td class="name">${contact.name}</td>
      <td class="address">${contact.address}</td>
      <td class="phone">${contact.phone}</td>
      <td>
        <button onclick="Contact.edit(${contact.id})"> EDITAR </button>
      </td>
      <td>
        <button onclick="Contact.remove(${contact.id})" > EXCLUIR </button>
      </td>
    `;
    return html;
  },
};

// editando os elementos html da tabela contatos
const FormEdit = {
  name: document.querySelector("input#nameEdit"),
  address: document.querySelector("input#addressEdit"),
  cep: document.querySelector("input#cepEdit"),
  phone: document.querySelector("input#phoneEdit"),

  updateAddress(cepAddress) {
    document.querySelector(
      "input#addressEdit"
    ).value = `${cepAddress.logradouro}, ${cepAddress.localidade} - ${cepAddress.uf}`;
  },

  getValues() {
    return {
      name: FormEdit.name.value,
      address: FormEdit.address.value,
      cep: FormEdit.cep.value,
      phone: FormEdit.phone.value,
    };
  },

  async getCep() {
    const { cep } = FormEdit.getValues();
    const url = `http://viacep.com.br/ws/${cep}/json/`;

    try {
      if (cep) {
        const cepData = await fetch(url);
        const cepAddress = await cepData.json();
        FormEdit.updateAddress(cepAddress);
      }
    } catch {
      alert("CEP não encontrado!");
    }
  },

  validateInputs() {
    const { name, address, phone } = FormEdit.getValues();

    if (name.trim() === "" || address.trim() === "" || phone.trim() == "") {
      throw new Error("Por favor, preencha todos os campos.");
    } else {
      return name, address, phone;
    }
  },

  submit(event) {
    event.preventDefault();

    try {
      FormEdit.validateInputs();
      Contact.remove(Contact.currentIdEdit);
      const newContact = FormEdit.getValues();
      newContact.id = Contact.currentIdEdit;
      Contact.add(newContact);
      ModalEditContact.close();
    } catch (error) {
      alert(error.message);
    }
  },
};

// form de adicao de novo contato
const FormAdd = {
  name: document.querySelector("input#nameAdd"),
  address: document.querySelector("input#addressAdd"),
  cep: document.querySelector("input#cepAdd"),
  phone: document.querySelector("input#phoneAdd"),

  updateAddress(cepAddress) {
    document.querySelector(
      "input#addressAdd"
    ).value = `${cepAddress.logradouro}, ${cepAddress.localidade} - ${cepAddress.uf}`;
  },

  getValues() {
    return {
      name: FormAdd.name.value,
      address: FormAdd.address.value,
      cep: FormAdd.cep.value,
      phone: FormAdd.phone.value,
    };
  },

  async getCep() {
    const { cep } = FormAdd.getValues();
    const url = `http://viacep.com.br/ws/${cep}/json/`;

    try {
      if (cep) {
        const cepData = await fetch(url);
        const cepAddress = await cepData.json();
        FormAdd.updateAddress(cepAddress);
      }
    } catch {
      alert("CEP não encontrado!");
    }
  },

  validateInputs() {
    const { name, address, phone } = FormAdd.getValues();

    if (name.trim() === "" || address.trim() === "" || phone.trim() == "") {
      throw new Error("Por favor, preencha todos os campos.");
    } else {
      return name, address, phone;
    }
  },

  clearInputs() {
    FormAdd.name.value = "";
    FormAdd.address.value = "";
    FormAdd.phone.value = "";
    FormAdd.cep.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      FormAdd.validateInputs();
      const contact = FormAdd.getValues();
      contact.id = Math.floor(Math.random() * 1000);
      Contact.add(contact);
      FormAdd.clearInputs();
      ModalAddContato.close();
    } catch (error) {
      alert(error.message);
    }
  },
};

DOM.reload();
