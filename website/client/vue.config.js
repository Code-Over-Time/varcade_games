module.exports = {
    runtimeCompiler: true,
    configureWebpack: {
        devServer: {
            headers: { 
                "Access-Control-Allow-Origin": "*" 
            },
            public: "192.168.1.113"
        }
    }
}