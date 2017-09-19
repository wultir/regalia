var GameUI = {
    setInputMenuTitle: function (act) {
        $("#InputMenuTitle").text(PerformTextReplacements(act.CustomChoiceTitle, null));
        $("#inputmenu").css("visibility", "visible");
        $("#inputmenu").toggleClass('cancellable', act.EnhInputData && act.EnhInputData.bAllowCancel);
    },

    showGameElements: function () {
        $("#RoomThumbImg").css("visibility", "visible");
        $("#PlayerImg").css("visibility", "visible");
        $("#RoomObjectsPanel").css("visibility", "visible");
        $("#VisibleCharactersPanel").css("visibility", "visible");
        $("#InventoryPanel").css("visibility", "visible");
        $(".compass-direction").css("visibility", "visible");
        SetExits();
    },

    hideGameElements: function () {
        $("#PlayerImg").css("visibility", "hidden");
        $("#RoomThumbImg").css("visibility", "hidden");
        $("#RoomObjectsPanel").css("visibility", "hidden");
        $("#VisibleCharactersPanel").css("visibility", "hidden");
        $("#InventoryPanel").css("visibility", "hidden");
        $(".compass-direction").css("visibility", "hidden");
    },

    clearInputChoices: function () {
        $("#inputchoices").empty();
    },

    clearCmdInputChoices: function () {
        $("#cmdinputchoices").empty();
    },

    setCmdInputMenuTitle: function (act, title) {
        $("#cmdInputMenuTitle").text(title);
        $("#cmdinputmenu").css("visibility", "visible");
        $("#cmdinputmenu").toggleClass('cancellable', act.EnhInputData && act.EnhInputData.bAllowCancel);
    },

    addInputChoice: function (InputDataObject, text, value) {
        var $div = $("<div>", {
            class: "inputchoices",
            text: text,
            value: value
        });

        $div.click(function() {
            selectedobj = $(this).val();
            if (selectedobj != null) {
                GameController.executeAndRunTimers(function () {
                    AdditionalData = selectedobj;
                    GameController.stopAwaitingInput();
                    $("#inputmenu").css("visibility", "hidden");
                    if (getObjectClass(InputDataObject) == "action" || "actionparent" in InputDataObject) {
                        ActionRecorder.choseInputAction(selectedobj);
                        ExecuteAction(InputDataObject, true, selectedobj);
                        if (bMasterTimer)
                            RunCommands.apply(null, pausecommandargs);
                        else
                            RunCommands(TheObj, selectedobj, InputDataObject, null);
                    }
                });
            }
        });

        $("#inputchoices").append($div);
    },

    addCmdInputChoice: function (text, value) {
        var $div = $("<div>", {
            class: "inputchoices",
            text: text,
            value: value
        });

        $div.click(function () {
            selectedobj = $(this).val();
            if (selectedobj != null) {
                GameController.executeAndRunTimers(function () {
                    $("#cmdinputmenu").hide();
                    GameController.stopAwaitingInput();
                    $("#cmdinputmenu").css("visibility", "hidden");
                    ActionRecorder.choseInputAction(selectedobj);
                    SetCommandInput(VariableGettingSet, selectedobj);
                    RunCommands.apply(null, pausecommandargs);
                });
            }
        });

        $("#cmdinputchoices").append($div);
        $("#cmdinputmenu").show();
    },

    setCmdInputForCustomChoices: function (title, tempcommand) {
        this.clearCmdInputChoices();
        for (var i = 0; i < tempcommand.CustomChoices.length; i++) {
            var text = PerformTextReplacements(tempcommand.CustomChoices[i]);
            this.addCmdInputChoice(text, text);
        }
        this.setCmdInputMenuTitle(tempcommand, title);
    },

    showTextMenuChoice: function (title) {
        $("#textMenuTitle").text(title);
        $("#textchoice").css("visibility", "visible");
        $("#textchoice input").focus();
    }
};