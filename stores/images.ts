import { defineStore } from "pinia"

export const useImagesStore = defineStore('images-store', {
	state: () => {
		return {
			imageList: [],
			selectedImage: null,
		}
	},
	actions: {
		async fetchImageList() {
			try {
				const response = await fetch("/api/get-images", {
					method: "GET",
					redirect: "follow"
				});

				const data = await response.json();
				this.imageList = data;
				this.selectedImage = data[0];
			} catch {
				console.error("Fetch Failed");
			}
		},
		setSelctedImage(image: any) {
			this.selectedImage = image;
		}
	}
});
