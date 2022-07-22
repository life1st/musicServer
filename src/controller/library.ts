class Library {
    isScanning = false
    
    scan() {
        this.isScanning = true
    }
}
const library = new Library()

export { library }
