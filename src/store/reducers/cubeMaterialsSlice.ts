// {type: 'cubeMaterials/materialTypeChanged', payload: {index, MaterialType}}
// {type: 'cubeMaterials/materialChanged', payload: {ndex, MaterialName}}

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import { MATERIALS_DATA } from "@/materialsData"

export type MaterialName = 'asphalt' | 'hexArmor' | 'geyserRock' | 'lightSofa' | 'titaniumScuffed' | 'wornFactorySiding'

export enum MaterialType {
  PBR,
  Phong,
}

type MaterialState = {
  name: MaterialName
  label: string
  type: MaterialType
}

export interface CubeState {
  selectedFaceIndex?: number
  materials: [
    MaterialState, 
    MaterialState, 
    MaterialState, 
    MaterialState, 
    MaterialState, 
    MaterialState 
  ]
}
  
const initialState: CubeState = {
  materials: [
    {
      name: 'wornFactorySiding',
      label: MATERIALS_DATA.wornFactorySiding.label,
      type: MaterialType.PBR
    },
    {
      name: 'hexArmor',
      label: MATERIALS_DATA.hexArmor.label,
      type: MaterialType.PBR
    },
    {
      name: 'geyserRock',
      label: MATERIALS_DATA.geyserRock.label,
      type: MaterialType.PBR
    },
    {
      name: 'lightSofa',
      label: MATERIALS_DATA.lightSofa.label,
      type: MaterialType.PBR
    },
    {
      name: 'titaniumScuffed',
      label: MATERIALS_DATA.titaniumScuffed.label,
      type: MaterialType.PBR
    },
    {
      name: 'asphalt',
      label: MATERIALS_DATA.asphalt.label,
      type: MaterialType.PBR
    },
  ]
}
  
const cubeSlice = createSlice({
    name: 'cube',
    initialState,
    reducers: {
      setMaterialTypeByFaceIndex: (state, action: PayloadAction<{index: number, type: MaterialType}>) => {
        const { index, type } = action.payload
        state.materials[index].type = type
      },
      setMaterialNameByFaceIndex: (state, action: PayloadAction<{index: number, name: MaterialName}>) => {
        const { index, name } = action.payload
        state.materials[index].name = name
      },
      setSelectedFaceIndex: (state, action: PayloadAction<number | undefined>) => {
        state.selectedFaceIndex = action.payload
      },
    }
})

export const { setMaterialTypeByFaceIndex, setMaterialNameByFaceIndex, setSelectedFaceIndex } = cubeSlice.actions

export const selectCube = (state: RootState) => state.cube

export default cubeSlice.reducer

