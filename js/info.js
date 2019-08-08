class Info {

    /**
     * Configura a api alvo
     * @constructor
     */
    constructor() {

        this.target = null;

        addEventListener('AoListar', function (e) {
            console.debug(e.detail);
        }, false);

        addEventListener('AoFalhar', function (e) {

            let mensagem = e.detail.request.responseJSON.mensagem;
            if (mensagem !== undefined) {
                console.error(mensagem);
            }

            let sql = e.detail.request.getAllResponseHeaders().split("\r\n").filter(function (item) {
                if (item.toLowerCase().indexOf('erro') > -1)
                    return item;
            });

            if (sql !== undefined && sql !== null && sql.length > 0) {
                sql[0].replace('erro:', '');
                console.log('%c' + sql, "background: #e4f5ff; color: #346dff");
            }

        }, false);


    }

    SetActiveUser(data) {

        let today = new Date();
        data.lastdate = today.format("yyyy-mm-dd");
        data.lasttime = today.format("HH:MM:ss");
        data.lastuser = JSON.parse(sessionStorage.auth).user.login;
        return data;

    }

    SetData(info) {

        let data = {};

        if (info !== undefined) {

            if (info.fields !== undefined)
                data.fields = info.fields;

            if (info.filter !== undefined)
                data.filter = info.filter;

            if (info.data !== undefined)
                data.data = info.data;

            if (info.last !== undefined)
                data.last = info.last;

            data = JSON.stringify(data);
        }

        return data;
    }

    /**
     * Lista todos os registros com ou sem a condição
     * @param info: Obrigatório -> os parâmetros podem ser (campos, filtros e callback)
     */
    Listar(info) {

        $.ajax({
            url: this.target,
            type: 'GET',
            dataType: 'json',
            data: this.SetData(info),
            success: (info.callback !== undefined) ? function (response) {
                    info.callback(response);
                } :
                function (response) {
                    dispatchEvent(
                        new CustomEvent('AoListar',
                            {
                                detail: response
                            })
                    );
                },
            error: function (request, status, error) {
                dispatchEvent(
                    new CustomEvent('AoFalhar',
                        {
                            detail: {
                                request: request,
                                status: status,
                                error: error
                            }
                        })
                );
            }
        });
    }

    /**
     * Adicionar novos registros
     * @param info -> (Obrigatório) Pode utilizar a matriz de array para multiplas inserções
     */
    Adicionar(info) {

        if (info === undefined || info === null)
            return;

        $.ajax({
            url: this.target,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(this.SetActiveUser(info)),
            success: (info.callback !== undefined) ? function (response) {
                    info.callback(response);
                } :
                function (response) {
                    dispatchEvent(
                        new CustomEvent('AoAdicionar',
                            {
                                detail: response
                            })
                    );
                },
            error: function (request, status, error) {
                dispatchEvent(
                    new CustomEvent('AoFalhar',
                        {
                            detail: {
                                request: request,
                                status: status,
                                error: error
                            }
                        })
                );
            }
        });

    }

    /**
     * Atualiza as informações de um registro
     * @param info -> (Obrigatório) Informações para substituição e critérios de identificação do registro
     */
    Atualizar(info) {

        $.ajax({
            url: this.target,
            type: 'PUT',
            dataType: 'json',
            data: this.SetData(this.SetActiveUser(info)),
            success: (info.callback !== undefined) ? function (response) {
                    info.callback(response);
                } :
                function (response) {
                    dispatchEvent(
                        new CustomEvent('AoAtualizar',
                            {
                                detail: response
                            })
                    );
                },
            error: function (request, status, error) {
                dispatchEvent(
                    new CustomEvent('AoFalhar',
                        {
                            detail: {
                                request: request,
                                status: status,
                                error: error
                            }
                        })
                );
            }
        });


    }

    /**
     * Remove um registro
     * @param info (Obrigatório) Critérios de identificação do registro
     * @constructor
     */
    Remover(info) {

        $.ajax({
            url: this.target,
            type: 'DELETE',
            dataType: 'json',
            data: this.SetData(info),
            success: (info.callback !== undefined) ? function (response) {
                    info.callback(response);
                } :
                function (response) {
                    dispatchEvent(
                        new CustomEvent('AoRemover',
                            {
                                detail: response
                            })
                    );
                },
            error: function (request, status, error) {
                dispatchEvent(
                    new CustomEvent('AoFalhar',
                        {
                            detail: {
                                request: request,
                                status: status,
                                error: error
                            }
                        })
                );
            }
        })

    }
}