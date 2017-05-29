$(function () {
    // Freelancer
    $('#toggle-dispo').change(function (e) {
        if (this.checked) {
            var parameters = {
                checked: true
            };
            $.ajax({
                url: '/endpoints/modifDispo',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        } else {
            var parameters = {
                checked: false
            };
            $.ajax({
                url: '/endpoints/modifDispo',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        }
    });
    $('#toggle-offresNotif').change(function (e) {
        if (this.checked) {
            var parameters = {
                checked: true
            };
            $.ajax({
                url: '/endpoints/modifNotifOffres',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        } else {
            var parameters = {
                checked: false
            };
            $.ajax({
                url: '/endpoints/modifNotifOffres',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        }
    });
    $('#toggle-empsNotif').change(function (e) {
        if (this.checked) {
            var parameters = {
                checked: true
            };
            $.ajax({
                url: '/endpoints/modifNotifEmps',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        } else {
            var parameters = {
                checked: false
            };
            $.ajax({
                url: '/endpoints/modifNotifEmps',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        }
    });
    $('#postulator').change(function (e) {
        if (this.checked) {
            $('#postulatorLabel').text('Postulé');
            var parameters = {
                checked: true,
                idOffre: $('#offreID').val()
            };
            $.ajax({
                url: '/endpoints/postuler',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        } else {
            $('#postulatorLabel').text('Postuler');
            var parameters = {
                checked: false,
                idOffre: $('#offreID').val()
            };
            $.ajax({
                url: '/endpoints/postuler',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        }
        location.reload();
    });
    // Employeur
    $('#toggle-visi').change(function (e) {
        if (this.checked) {
            var parameters = {
                checked: true
            };
            $.ajax({
                url: '/endpoints/modifVisi',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        } else {
            var parameters = {
                checked: false
            };
            $.ajax({
                url: '/endpoints/modifVisi',
                dataType: 'text',
                method: 'put',
                data: parameters,
                success: function (data, textStatus, jQxhr) {
                    console.log('Success')
                },
                error: function (jqXhr, textStatus, errorThrown) {
                    console.log(errorThrown)
                }
            });
        }
    });
});