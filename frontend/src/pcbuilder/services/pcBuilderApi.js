import axios from "axios";

/* ---------------- AXIOS INSTANCE ---------------- */

const API = axios.create({
    baseURL: "http://localhost:5000/api/pcbuilder",
    withCredentials: true
});

/* ---------------- TOKEN INTERCEPTOR ---------------- */

API.interceptors.request.use((config) => {

    const user = JSON.parse(localStorage.getItem("ix_user") || "null");

    if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }

    return config;

}, (error) => {
    return Promise.reject(error);
});


/* ---------------- API METHODS ---------------- */

const pcBuilderApi = {

    /* GET COMPONENTS */

    getComponents: async (category) => {

        try {

            const res = await API.get(`/components/${category}`);

            return res.data;

        } catch (err) {

            console.error("Component fetch error:", err);
            throw err;

        }

    },


    /* CHECK COMPATIBILITY */

    checkCompatibility: async (components) => {

        try {

            const res = await API.post("/check-compatibility", {
                components
            });

            return res.data;

        } catch (err) {

            console.error("Compatibility error:", err);
            throw err;

        }

    },


    /* SAVE BUILD */

    saveBuild: async (data) => {

        try {

            const res = await API.post("/save-build", data);

            return res.data;

        } catch (err) {

            console.error("Save build error:", err);
            throw err;

        }

    },


    /* GET USER BUILDS */

    getUserBuilds: async () => {

        try {

            const res = await API.get("/my-builds");

            return res.data;

        } catch (err) {

            console.error("Fetch builds error:", err);
            throw err;

        }

    },


    /* GET BUILD BY ID */

    getBuildById: async (buildId) => {

        try {

            const res = await API.get(`/build/${buildId}`);

            return res.data;

        } catch (err) {

            console.error("Fetch build error:", err);
            throw err;

        }

    },


    /* DELETE BUILD */

    deleteBuild: async (buildId) => {

        try {

            const res = await API.delete(`/build/${buildId}`);

            return res.data;

        } catch (err) {

            console.error("Delete build error:", err);
            throw err;

        }

    },


    /* ADD TEMP BUILD TO CART */

    addBuildToCart: async (components) => {

        try {

            const res = await API.post("/add-build-to-cart", components);

            return res.data;

        } catch (err) {

            console.error("Add build to cart error:", err);
            throw err;

        }

    }

};

export default pcBuilderApi;