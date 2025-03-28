import{ world, system } from "@minecraft/server";

export class Config {
    constructor(identifier, name, icon_path = undefined){
        this.dimension = world.getDimension("minecraft:overworld");
        this.name = name;
        this.identifier = identifier;
        this.icon_path = icon_path;
        this.config = [];
        this.config_value = {};

        system.afterEvents.scriptEventReceive.subscribe( s => {
            if(s.id == "config:refresh"){
                let data = s.message.split(" ");
                if(data[0] != "load_config_addon:" + this.identifier);
                if(this.config_value[data[1]] != undefined){
                    this.config_value[data[1]] = data[2];
                }
            }
        }, { namespaces: [ "config" ]});
    }

    addComponent(component){
        if(Array.isArray(component)){
            component.forEach(e=>{
                this.config_value[e.identifier] = e.value;
                this.config.push(e);
            });
        }else{
            this.config_value[component.identifier] = component.value;
            this.config.push(component);
        }
    }

    getAllValue(){
        let data = {};
        for(let value_name of Object.keys(this.config_value)){
            let value = this.config_value[value_name];
            if(!isNaN(value)){
                value = Number(value);
            }else{
                if(value == "false"){
                    value = false;
                }else if(value == "true"){
                    value = true;
                }
            }
            data[value_name] = value;
        }
        
        return data;
    }

    getValue(identifier){
        let value = this.config_value[identifier];

        if(!isNaN(value)){
            value = Number(value);
        }else{
            if(value == "false"){
                value = false;
            }else if(value == "true"){
                value = true;
            }
        }
        return value;
    }

    setValue(identifier, value){
        if(this.config_value[identifier] == undefined) return false;
        this.config_value[identifier] = value;
        this.dimension.runCommand("scriptevent config:change " + identifier + " " + value);
    }

    send(){
        let data = {
            "config_name": this.identifier,
            "config_display_name": this.name,
            "config_data": this.config,
            "icon_path": this.icon_path
        }
        system.runTimeout(()=>{
            for(let split_data of JSON.stringify(data).match(/.{1,255}/g)){
                this.dimension.runCommand("scriptevent load_config_addon:" + this.identifier + " " + split_data);
            }
        })
    }
}