const vm = new Vue({
  el: "#app",
  data: {
    produtos: [],
    produto: false,
    carrinho: [],
    msg: "Item adicionado",
    alertaAtivo: false,
    carrinhoAtivo:false
  },
  filters: {
    numberForPrice(valor) {
      return valor.toLocaleString("he-IL", {
        style: "currency",
        currency: "nis",
      });
    },
  },
  computed: {
    carrinhoTotal() {
      let total = 0;
      if (this.carrinho.length) {
        this.carrinho.forEach((item) => {
          total += item.preco;
        });
      }
      return total;
    },
  },
  methods: {
    fetchProduct() {
      fetch("./api/produtos.json")
        .then((res) => res.json())
        .then((json) => (this.produtos = json));
    },
    fetchProduto(id) {
      fetch(`./api/produtos/${id}/dados.json`)
        .then((response) => response.json())
        .then((json) => (this.produto = json));
    },
    abrirModal(id) {
      this.fetchProduto(id);
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    fecharModal({ currentTarget, target }) {
      if (target === currentTarget) this.produto = false;
    },
    adicionarItem() {
      this.produto.estoque--;
      const { id, nome, preco, img } = this.produto;
      this.carrinho.push({ id, nome, preco, img });
      this.alerta(`${nome} adicionado ao carrinho`);
    },
    remover(index) {
      this.carrinho.splice(index, 1);
    },
    checarLocalStorage() {
      if (window.localStorage.carrinho) {
        this.carrinho = JSON.parse(window.localStorage.carrinho);
      }
    },
    alerta(msg) {
      this.msg = msg;
      this.alertaAtivo = true;
      setTimeout(() => {
        this.alertaAtivo = false;
      }, 1500);
    },
    router() {
      const hash = document.location.hash;
      if (hash) this.fetchProduto(hash.replace("#", ""));
    },
    foracarrinho({ currentTarget, target }) {
      if (target === currentTarget) this.carrinhoAtivo = false;
    },
    compararEstoque(){
      const items = this.carrinho.filter(item =>{
        if(item.id === this.produto.id)
        return true
      })
      this.produto.estoque = this.produto.estoque - items.length
    }

    
  },
  watch: {
    carrinho() {
      window.localStorage.carrinho = JSON.stringify(this.carrinho);
    },
    produto() {
      document.title = this.produto.nome || "Techno";
      const hash = this.produto.id || "";
      history.pushState(null, null, `#${hash}`);
      if(this.produto){
        this.compararEstoque()
      }
    },
    
  },
  created() {
    this.fetchProduct();
    this.checarLocalStorage();
    this.router();
    
  },
});
