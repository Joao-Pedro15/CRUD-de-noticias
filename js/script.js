var firebaseConfig = {
    apiKey: "AIzaSyCHm43E4B2VFtEUyQAkpnhLZuvTc08ZvqM",
    authDomain: "prova-devmedia.firebaseapp.com",
    projectId: "prova-devmedia",
    storageBucket: "prova-devmedia.appspot.com",
    messagingSenderId: "253067578406",
    appId: "1:253067578406:web:16558283a39aabc98daae7"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore()
const dbCategories = 'categorias'
const dbNews = 'noticias'
const inputCategory = document.getElementById('inputCategoria')
const inputTitle = document.getElementById('inputTitle')
const inputNews = document.getElementById('inputNews')
const currentCategory = document.getElementById('select')
const container = document.querySelector('.container')
const search = document.getElementById('search')



function showNewsInHome(title, content, id, contain){
    let div = document.createElement('div')
    div.classList.add('news')

    let titleContent = document.createElement('div')
    titleContent.classList.add('title-content')

    let h1 = document.createElement('h1')
    let h1txt = document.createTextNode(title)
    h1.appendChild(h1txt)

    let p = document.createElement('p')
    let ptxt = document.createTextNode(content)
    p.appendChild(ptxt)


    let btn = document.createElement('button')
    let btntxt = document.createTextNode('Acessar')
    btn.appendChild(btntxt)
    btn.id = id
    btn.setAttribute('onclick', 'openEditRemove(this)')

    titleContent.appendChild(h1)
    titleContent.appendChild(p)
    div.appendChild(titleContent)
    div.appendChild(btn)

    contain.prepend(div)
}


function loadedNews(){
    container.innerHTML = ''
    db.collection(dbNews).onSnapshot(snapshot=>{
        snapshot.forEach(doc=>{
            let news = doc.data()
            showNewsInHome(news.titulo, news.conteudo, doc.id, container)
        })
    })
}




function addCategory(){
    db.collection(dbCategories).add({
        categoria: inputCategory.value
    }).then(snapshot=>{
        inputCategory.value = ''
        alert('Categoria cadastrada!')
    }).catch(err=>{
        console.log(err)
    })
}


function addNews(){
    db.collection(dbNews).add({
        titulo: inputTitle.value,
        categoria: currentCategory.value,
        conteudo: inputNews.value,
    }).then(snapshot=>{
        inputTitle.value = ''
        inputNews.value = ''
        alert('Notícia cadastrada!')
    }).catch(err=>{
        console.log(err)
    })
}



function loadedategories(page){
    
    db.collection(dbCategories).get()
    .then(snapshot=>{
        snapshot.forEach(doc=>{
            let category = doc.data().categoria
            page.innerHTML += `<option value='${category}'>${category}</option>`
            
        })
    })
}

function openEditRemove(element){
    let id = element.id
    localStorage.setItem('id', JSON.stringify(id))
    window.location.href = 'editar.html'
}

function loadedEditRemove(){
    let editInputTitle = document.getElementById('editInputTitle')
    let editInputNews = document.getElementById('editInputNews')
    let editSelect = document.getElementById('editSelect')
    let id = JSON.parse(localStorage.getItem('id'))
    db.collection(dbNews).doc(id).get().then(doc=>{
        let dados = doc.data()
        editInputTitle.value = dados.titulo
        editInputNews.value = dados.conteudo
        editSelect.value = dados.categoria

    })
}

function updateNews(){
    let editInputTitle = document.getElementById('editInputTitle')
    let editInputNews = document.getElementById('editInputNews')
    let editSelect = document.getElementById('editSelect')
    let id = JSON.parse(localStorage.getItem('id'))
    db.collection(dbNews).doc(id).update({
        titulo: editInputTitle.value,
        conteudo: editInputNews.value,
        categoria: editSelect.value
    }).then(()=>{
        console.log('Notícia atualizada!')
    }).catch(err=>{
        console.log(err)
    })
}


function deleteNews(){
    let id = JSON.parse(localStorage.getItem('id'))
    db.collection(dbNews).doc(id).delete().then(()=>{
        alert('Notícia deletada!')
    }).catch(err=>{
        console.log(err)
    })
}

function backToHome(){
    window.location.href = 'index.html'
}


function searchNews(){
    if(search.value == ''){
        container.innerHTML = ''
        loadedNews()
    }else {
        db.collection(dbNews).where('categoria', '==', search.value).get().then(snapshot=>{
            container.innerHTML = ''
            snapshot.forEach(doc=>{
                let n = doc.data()
                showNewsInHome(n.titulo, n.conteudo, doc.id, container)
                search.value = ''
            })
        }).catch(err=>{
            console.log(err)
        })
    }
}

search.addEventListener('keypress', (e)=>{
    if(e.keyCode == 13) {
        searchNews()
    }
})