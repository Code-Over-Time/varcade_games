module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
        devServer: {
            headers: { 
                "Access-Control-Allow-Origin": "*" 
            },
            public: "varcade.local"
        }
    }
}