$(function () {
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
});