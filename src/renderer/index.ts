(async () => {
    await import('../InitRenderer.js');
    const { sampleForm } = await import("./controls/sampleForm.uc.js");
    // const frm = await sampleForm.CreateAsync({ targetElement: document.body });
    // await frm.ucExtends.showDialog();
})();

