// localdb.js
class LocalStore {
    constructor(key) {
        this.key = key;
        this.data = this.loadData();
    }

    loadData() {
        try {
            const stored = localStorage.getItem(this.key);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error("Erro ao carregar dados do LocalStorage:", e);
            return [];
        }
    }

    saveData() {
        try {
            localStorage.setItem(this.key, JSON.stringify(this.data));
        } catch (e) {
            console.error("Erro ao salvar dados no LocalStorage:", e);
        }
    }

    add(item) {
        // Simula um ID simples
        item.id = Date.now();
        this.data.push(item);
        this.saveData();
        return item;
    }

    get(id) {
        return this.data.find(item => item.id === id);
    }

    getAll() {
        return [...this.data]; // Retorna uma cópia para evitar modificações diretas
    }

    update(id, newItem) {
        const index = this.data.findIndex(item => item.id === id);
        if (index > -1) {
            this.data[index] = { ...this.data[index], ...newItem, id: id }; // Garante que o ID não muda
            this.saveData();
            return true;
        }
        return false;
    }

    delete(id) {
        const initialLength = this.data.length;
        this.data = this.data.filter(item => item.id !== id);
        if (this.data.length < initialLength) {
            this.saveData();
            return true;
        }
        return false;
    }
}

// Uso:
// const myStore = new LocalStore('meuAppDados');
// myStore.add({ name: 'Carl', age: 26 });
// console.log(myStore.getAll());