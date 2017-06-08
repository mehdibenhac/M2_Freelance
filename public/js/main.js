Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});

$(document).ready(function () {
    $.ajax({
        url: '/endpoints/notifsCount',
        dataType: 'json',
        method: 'get',
        success: function (data, textStatus, jQxhr) {
            var count = parseInt(data.count);
            if (count > 0) {
                $('#notifLabel').html(count)
            }
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
    $.ajax({
        url: '/endpoints/msgCount',
        dataType: 'json',
        method: 'get',
        success: function (data, textStatus, jQxhr) {
            var count = parseInt(data.count);
            if (count > 0) {
                $('#msgLabel').html(count)
            }
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown)
        }
    });
    $('.ui.dropdown')
        .dropdown();
    $('select.dropdown')
        .dropdown();
    $('.ui.radio.checkbox')
        .checkbox();
    $('.ui.checkbox')
        .checkbox();
    $('.ui.rating')
        .rating('disable');
    $('#sidebaror').click(function () {
        $('.ui.sidebar')
            .sidebar('toggle');
    });
    $('#daysPercent').progress();
    $('#dateDebut').val(new Date().toDateInputValue());
    $('#dateFin').attr("min", new Date().toDateInputValue());
    $('.ui.star.rating')
        .popup();
    $('.ui.label')
        .popup();
    $('#offresTable').tablesorter({
        dateFormat: "ddmmyyyy"
    });
    $('button[type=reset]').click(function () {
        $('.ui.dropdown').dropdown('clear');
    });
    $('.message .close')
        .on('click', function () {
            $(this)
                .closest('.message')
                .transition('fade');
        });
    $.fn.form.settings.rules.greaterThan = function (value, secondField) {
        var secondValue = parseInt($('input[name=' + secondField + ']').val()) + 6;
        return (value > secondValue)
    };
    $('.ui.form')
        .form({
            fields: {
                objet: {
                    identifier: 'objet',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir un objet pour votre message.'
                    }]
                },
                contenu: {
                    identifier: 'contenu',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir un contenu pour votre message.'
                    }]
                },
                dest: {
                    identifier: 'dest',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir un destinataire pour votre message.'
                    }]
                },
                titreOffre: {
                    identifier: 'titreOffre',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir un titre pour votre offre.'
                    }]
                },
                titreOffre: {
                    identifier: 'titreOffre',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir un titre pour votre offre.'
                    }]
                },
                descriptionOffre: {
                    identifier: 'descriptionOffre',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir une description pour votre offre.'
                    }]
                },
                competOffre: {
                    identifier: 'competOffre',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez selectionner une compétence.'
                    }]
                },
                dureeMin: {
                    identifier: 'dureeMin',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir une durée minimum.'
                    }]
                },
                dureeMax: {
                    identifier: 'dureeMax',
                    rules: [{
                        type: 'greaterThan[dureeMin]',
                        prompt: 'Un écart de 7 jours est requis entre la durée minimale et maximale.'
                    }]
                },
                conditionOffre: {
                    identifier: 'conditionOffre',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez selectionner un fichier à télécharger.'
                    }]
                },
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'email',
                        prompt: 'Veuillez saisir une adresse mail valide.'
                    }]
                },
                telephone: {
                    identifier: 'telephone',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir un numéro de téléphone valide'
                    }]
                },
                wilayaAdr: {
                    identifier: 'wilayaAdr',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez sélectionner une wilaya'
                    }]
                },
                communeAdr: {
                    identifier: 'communeAdr',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir le nom de votre commune'
                    }]
                },
                quartierAdr: {
                    identifier: 'quartierAdr',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir le nom de votre quartier'
                    }]
                },
                lotissementAdr: {
                    identifier: 'lotissementAdr',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez saisir votre numéro de lotissement'
                    }]
                },
                justif0: {
                    identifier: 'justif0',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez sélectionner un justificatif pour la premiére compétence'
                    }]
                },
                justif1: {
                    identifier: 'justif1',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez sélectionner un justificatif pour la deuxiéme compétence'
                    }]
                },
                justif2: {
                    identifier: 'justif2',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez sélectionner un justificatif pour la troisiéme compétence'
                    }]
                },
                justif3: {
                    identifier: 'justif3',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez sélectionner un justificatif pour la quatriéme compétence'
                    }]
                },
                compets: {
                    identifier: 'compets',
                    rules: [{
                        type: 'minCount[1]',
                        prompt: 'Selectionnez au moins une compétence.'
                    }, {
                        type: 'maxCount[4]',
                        prompt: 'Vous avez selectionné plus de quatre compétences.'
                    }]
                },
                domaines: {
                    identifier: 'domaines',
                    rules: [{
                        type: 'minCount[1]',
                        prompt: 'Selectionnez au moins un domaine.'
                    }, {
                        type: 'maxCount[4]',
                        prompt: 'Vous avez selectionné plus de quatre domaines.'
                    }]
                }
            }
        });
    // Any modal validation with onClick button

    $('.validateModal').click(function () {
        $('.ui.modal').modal({
            closable: false,
            onApprove: function () {
                $('.ui.form').submit();
            }
        }).modal('show');
    });
    $('.contactModal').click(function () {
        $('.ui.contact.modal').modal('show');
    });
    $('.acceptar').click(function () {
        $('.ui.accept.modal').modal({
            closable: false,
            onApprove: function () {
                $('.ui.accept.form').submit();
            }
        }).modal('show');
    });
    $('.ui.cloturar.form').form({
        fields: {
            note: {
                identifier: 'note',
                rules: [{
                    type: 'empty',
                    prompt: 'Veuillez sélectionner une note.'
                }]
            },
        }
    })
    $('.cloturar').click(function () {
        $('.ui.cloturar.modal').modal({
            closable: true,
            onApprove: function () {
                $('.ui.cloturar.form').submit();
            }
        }).modal('show');
    });
    // Contrat form validation
    $('.ui.form.contratForm').form({
        fields: {
            dateFin: {
                identifier: 'dateFin',
                rules: [{
                    type: 'empty',
                    prompt: 'Veuillez saisir la date d\'échéance du contrat.'
                }]
            },
            termes: {
                identifier: 'termes',
                rules: [{
                    type: 'checked',
                    prompt: 'Veuillez accepter les termes d\'utilisation.'
                }]
            },
        },
        onSuccess: function (event, fields) {
            $('.ui.modal').modal({
                closable: false,
                onApprove: function () {
                    $('.ui.form.contratForm').submit();
                }
            }).modal('show');
        }
    })
    $('.validateContrat').click(function () {
        $('.ui.form.contratForm').form('validate form');
    })

    // Signup 1 form validation
    $('.ui.form.signup-1')
        .form({
            fields: {
                pnom: {
                    identifier: 'pnom',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez renseigner votre prénom.'
                    }]
                },
                nom: {
                    identifier: 'nom',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez renseigner votre nom.'
                    }]
                },
                email: {
                    identifier: 'email',
                    rules: [{
                        type: 'email',
                        prompt: 'Veuillez saisir une adresse mail valide.'
                    }]
                },
                telephone: {
                    identifier: 'telephone',
                    rules: [{
                        type: 'minLength[9]',
                        prompt: 'Veuillez saisir un numéro de téléphone valide.'
                    }, {
                        type: 'maxLength[10]',
                        prompt: 'Veuillez saisir un numéro de téléphone valide.'
                    }]
                },
                dateNaiss: {
                    identifier: 'dateNaiss',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez renseigner votre date de naissance'
                    }]
                },
                lieuNaiss: {
                    identifier: 'lieuNaiss',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez renseigner votre lieu de naissance'
                    }]
                },
                wilayaAdr: {
                    identifier: 'wilayaAdr',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez renseigner votre Wilaya de résidence'
                    }]
                },
                communeAdr: {
                    identifier: 'communeAdr',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez renseigner votre commune de résidence'
                    }]
                },
                quartierAdr: {
                    identifier: 'quartierAdr',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez renseigner votre quartier de résidence'
                    }]
                },
                lotissementAdr: {
                    identifier: 'lotissementAdr',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veuillez renseigner votre numéro de lotissement'
                    }]
                }

            }
        });

    // Signup 2 form validation

    $('.ui.form.signup-2')
        .form({
            fields: {
                compets: {
                    identifier: 'compets',
                    rules: [{
                        type: 'minCount[1]',
                        prompt: 'Selectionnez au moins une compétence.'
                    }, {
                        type: 'maxCount[4]',
                        prompt: 'Vous avez selectionné plus de quatre compétences.'
                    }]
                }
            }
        });

    // Signup 3 form validation

    $('.ui.form.signup-3')
        .form({
            fields: {
                username: {
                    identifier: 'username',
                    rules: [{
                        type: 'minLength[8]',
                        prompt: 'Veuillez saisir un nom d\'utilisateur entre 8 et 16 caractéres.'
                    }, {
                        type: 'maxLength[16]',
                        prompt: 'Veuillez saisir un nom d\'utilisateur entre 8 et 16 caractéres.'
                    }]
                },
                password: {
                    identifier: 'password',
                    rules: [{
                        type: 'minLength[6]',
                        prompt: 'Veuillez saisir un mot de passe entre 6 et 16 caractéres.'
                    }, {
                        type: 'maxLength[16]',
                        prompt: 'Veuillez saisir un mot de passe entre 6 et 16 caractéres.'
                    }]
                },
                REpassword: {
                    identifier: 'REpassword',
                    rules: [{
                        type: 'match[password]',
                        prompt: 'Veuillez vérifier le second mot de passe saisi.'
                    }]
                }
            }
        });
    $('.termes-opener').click(function () {
        $('.termes').modal({
            closable: false,
            onApprove: function () {
                console.log('Got to here...')
                $(".ui.form").submit();
            }
        }).modal('show');
    });
    // SPECIAL EMPLOYEUR!
    $('.ui.form.signup-3.employeur')
        .form({
            fields: {
                username: {
                    identifier: 'username',
                    rules: [{
                        type: 'minLength[8]',
                        prompt: 'Veuillez saisir un nom d\'utilisateur entre 8 et 16 caractéres.'
                    }, {
                        type: 'maxLength[16]',
                        prompt: 'Veuillez saisir un nom d\'utilisateur entre 8 et 16 caractéres.'
                    }]
                },
                password: {
                    identifier: 'password',
                    rules: [{
                        type: 'minLength[6]',
                        prompt: 'Veuillez saisir un mot de passe entre 6 et 16 caractéres.'
                    }, {
                        type: 'maxLength[16]',
                        prompt: 'Veuillez saisir un mot de passe entre 6 et 16 caractéres.'
                    }]
                },
                REpassword: {
                    identifier: 'REpassword',
                    rules: [{
                        type: 'match[password]',
                        prompt: 'Veuillez vérifier le second mot de passe saisi.'
                    }]
                }
            },
            onSuccess: function (event, fields) {
                $('.termesConfirmar').modal({
                    closable: false,
                    onApprove: function () {
                        $('.ui.form.signup-3.employeur').submit();
                    }
                }).modal('show');
            }
        });
    $('.termesConfirmar-opener').click(function () {
        $('.ui.form.signup-3.employeur').form('validate form')
    });
    // Signup 4 form validation

    $('.ui.form.signup-4')
        .form({
            fields: {
                justif0: {
                    identifier: 'justif0',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veulliez fournir un justificatif pour la 1ére compétence.'
                    }]
                },
                justif1: {
                    identifier: 'justif1',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veulliez fournir un justificatif pour la 2éme compétence.'
                    }]
                },
                justif2: {
                    identifier: 'justif2',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veulliez fournir un justificatif pour la 3éme compétence.'
                    }]
                },
                justif3: {
                    identifier: 'justif3',
                    rules: [{
                        type: 'empty',
                        prompt: 'Veulliez fournir un justificatif pour la 4éme compétence.'
                    }]
                }
            },
            onSuccess: function (event, fields) {
                $('.confirmar').modal({
                    closable: false,
                    onApprove: function () {
                        $(".ui.form.signup-4").submit();
                    }
                }).modal('show');
            }
        });
    $('.confirmar-opener').click(function () {
        $('.ui.form.signup-4').form('validate form')
    });
    $('.passVerif-opener').click(function () {
        $('.passVerif').modal({
            closable: false,
            onApprove: function () {
                $(".ui.form.signup-4").attr('action', '/freelancer/signup/final?skip=true');
                $(".ui.form.signup-4").form({});
                $(".ui.form.signup-4").submit();
            }
        }).modal('show');
    });
});