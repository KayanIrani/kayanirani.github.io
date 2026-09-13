

import {MeshBasicMaterial} from "three"
export const convertMaterialsToMeshBasicMaterial = (materials) =>{
    Object.keys(materials).forEach((materialKey)=>{
        const material = materials[materialKey]
        if (material.emisiveMap){
            materials[materialKey] = new MeshBasicMaterial({
                map: material.emissiveMap,
            })
        }
        else{
            materials[materialKey] = new MeshBasicMaterial({
                map: material.map,
                transparent: true,
                alphaTest: 0.5,
            })
        }
    })

    return materials
}