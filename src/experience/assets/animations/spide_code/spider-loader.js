AFRAME.registerComponent("spider-anim-loader", {
  schema: {
    walk: {
      type: "string",
      default: "../assets/spider/animations/walk/Giant_Spider_walk.glb",
    },
    attack: {
      type: "string",
      default: "../assets/spider/animations/attack/Giant_Spider_attack.glb",
    },
    final_rig: {
      type: "string",
      default: "../assets/spider/animations/final_rig/Giant_Spider.glb",
    },
    idle: { type: "string", default: "" },
  },

  init: function () {
    this.loader = new THREE.GLTFLoader();
    this.model = null;

    this.el.addEventListener("model-loaded", (e) => {
      this.model = e.detail.model;
      this.loadExternalAnimations();
    });
  },

  loadExternalAnimations: function () {
    const data = this.data;
    const modelAnimations = this.model.animations;

    const toLoad = [
      { name: "Walk", url: data.walk },
      { name: "Attack", url: data.attack },
      { name: "Death", url: data.final_rig },
      { name: "Idle", url: data.idle },
    ];

    const promises = [];

    toLoad.forEach((item) => {
      if (item.url) {
        const p = new Promise((resolve) => {
          this.loader.load(
            item.url,
            (gltf) => {
              if (gltf.animations && gltf.animations.length > 0) {
                const clip = gltf.animations[0];
                clip.name = item.name;
                modelAnimations.push(clip);
              }
              resolve();
            },
            undefined,
            (err) => resolve()
          );
        });
        promises.push(p);
      }
    });

    Promise.all(promises).then(() => {
      console.log("Animações carregadas.");
      this.el.emit("animations-ready");
    });
  },
});
