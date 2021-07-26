class PhotoGallery {
  constructor() {
    this.API_KEY = "563492ad6f917000010000013f538d9e74984b5db2ea9a886ff503ba";
    this.main = document.querySelector("main");
    this.gallery = document.querySelector(".gallery");
    this.form = document.querySelector("form");
    this.btn = document.querySelector(".show-more");
    this.pageIndex = 1;
    this.eventHandle();
  }
  //HANDLE
  eventHandle() {
    document.addEventListener("DOMContentLoaded", () => {
      this.getImg(this.pageIndex);
    });
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.pageIndex = 1;
      this.gallery.innerHTML = "";
      this.getSearchedImg(e);
    });
    this.btn.addEventListener("click", (e) => {
      e.preventDefault();
      this.showMore(e);
    });
    document.addEventListener("click", (e) => {
      if (e.target.matches(".image img")) {
        this.modalImage(e);
      }
      if (e.target.matches(".modal") || e.target.matches(".modal *")) {
        this.main.removeChild(document.querySelector(".modal"));
      }
    });
  }
  //GET IMAGES
  async getImg(index) {
    this.btn.setAttribute("data-img", "curated");
    const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=6`;
    const data = await this.fetchImages(baseURL);
    this.imgGenerator(data);
  }
  //FETCH CALL
  async fetchImages(baseURL) {
    const response = await fetch(baseURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: this.API_KEY,
      },
    });
    const data = await response.json();
    return data;
  }
  // IMAGE GENERATOR
  imgGenerator(data) {
    data.photos.forEach((photo, index) => {
      const img = document.createElement("div");
      img.classList.add("image");
      img.innerHTML = `
      <img src="${photo.src.medium}" data-index="${index}" data-photographer="${photo.photographer}" alt="image photo by${photo.photographer}">
      <span>Photographer: <b>${photo.photographer}<b></span>
      `;
      this.gallery.appendChild(img);
    });
  }
  //GET SEARCHED IMAGES
  async getSearchedImg(e) {
    if (e.target.querySelector("input").value === "") {
      this.getImg(this.pageIndex);
    } else {
      this.btn.setAttribute("data-img", "search");
      const searchValue = e.target.querySelector("input").value;
      const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=${this.pageIndex}&per_page=6`;
      const searchedData = await this.fetchImages(baseURL);
      this.imgGenerator(searchedData);
    }
  }
  //GET MORE SEARCH IMAGES
  async getMoreSearchedImg() {
    const searchValue = this.form.querySelector("input").value;
    const baseURL = `https://api.pexels.com/v1/search?query=${searchValue}&page=${this.pageIndex}&per_page=6`;
    const searchedData = await this.fetchImages(baseURL);
    this.imgGenerator(searchedData);
  }
  //SHOW-MORE
  async showMore(e) {
    e.target.disabled = true;
    this.pageIndex = ++this.pageIndex;
    const btnAtt = e.target.getAttribute("data-img");
    if (btnAtt === "curated") {
      await this.getImg(this.pageIndex);
    } else {
      await this.getMoreSearchedImg();
    }
    e.target.disabled = false;
  }
  //MODAL IMAGE
  modalImage(e) {
    const src = e.target.src;
    const newsrc = src.replace("h=350", "dpr=2&h=650&w=940");

    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.innerHTML = `
    <div class="modal-container">
      <img class="modal-img" src="${newsrc}" alt="${e.target.getAttribute(
      "alt"
    )}">
      <span class="modal-span">Photographer: <b>${e.target.getAttribute(
        "data-photographer"
      )}<b></span>
    </div>
    `;
    this.main.appendChild(modal);
  }
}

const gallery = new PhotoGallery();

// "https://images.pexels.com/photos/7681340/pexels-photo-7681340.jpeg?auto=compress&cs=tinysrgb& fit=crop&h=627&w=1200"
// "https://images.pexels.com/photos/7681340/pexels-photo-7681340.jpeg?auto=compress&cs=tinysrgb& h=650&w=940"
// "https://images.pexels.com/photos/7681340/pexels-photo-7681340.jpeg?auto=compress&cs=tinysrgb& dpr=2&h=650&w=940"
// "https://images.pexels.com/photos/7681340/pexels-photo-7681340.jpeg?auto=compress&cs=tinysrgb& h=350"
// "https://images.pexels.com/photos/7681340/pexels-photo-7681340.jpeg"
// "https://images.pexels.com/photos/7681340/pexels-photo-7681340.jpeg?auto=compress&cs=tinysrgb& fit=crop&h=1200&w=800"
// "https://images.pexels.com/photos/7681340/pexels-photo-7681340.jpeg?auto=compress&cs=tinysrgb& h=130"
// "https://images.pexels.com/photos/7681340/pexels-photo-7681340.jpeg?auto=compress&cs=tinysrgb& dpr=1&fit=crop&h=200&w=280
