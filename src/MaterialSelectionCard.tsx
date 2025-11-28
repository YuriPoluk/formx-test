import {
    Card,
    CardContent,
  } from "@/components/ui/card"
import { useAppSelector, useAppDispatch } from "./hooks/redux"
import { Switch } from "./components/ui/switch"
import { Label } from "./components/ui/label"
import { isSomething } from "tsjam"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MATERIALS_DATA } from "./materialsData"
import { setMaterialTypeByFaceIndex, setMaterialNameByFaceIndex, MaterialType, type MaterialName } from './store/reducers/cubeMaterialsSlice';


function MaterialSelectionCard()  {
      const cubeMaterials = useAppSelector(state => state.cube)
      const selectedFaceIndex = cubeMaterials.selectedFaceIndex
      const dispatch = useAppDispatch()

      let selectedFaceMaterial
      if (isSomething(selectedFaceIndex)) {
        selectedFaceMaterial = cubeMaterials.materials[selectedFaceIndex]
      }

      const onMaterialTypeChange = (checked: boolean) =>
        dispatch(setMaterialTypeByFaceIndex({
            index: selectedFaceIndex!, 
            type: checked ?  MaterialType.PBR : MaterialType.Phong
        }))

      const onMaterialSelected = (m: MaterialName) =>
        dispatch(setMaterialNameByFaceIndex({
            index: selectedFaceIndex!, 
            name: m
        }))

      const placeholder = 
      <div className="flex items-center justify-center m-0 mx-auto">
        Click on the cube to select face and change material
      </div>

      const cardContent = (
        <div className="flex flex-col gap-6">
            <div className="flex items-center space-x-2">
                Material:&nbsp;<span className="font-bold">{selectedFaceMaterial?.label}</span>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="pbr" 
                    checked={selectedFaceMaterial?.type == MaterialType.PBR} 
                    onCheckedChange={onMaterialTypeChange} 
                />
                <Label htmlFor="pbr">PBR</Label>
            </div>
            <div className="flex items-center space-x-2">
            <Select onValueChange={onMaterialSelected} value={selectedFaceMaterial?.name}>
                <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Select a material" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                    <SelectLabel>Materials</SelectLabel>
                    <SelectItem value="asphalt">{MATERIALS_DATA.asphalt.label}</SelectItem>
                    <SelectItem value="hexArmor">{MATERIALS_DATA.hexArmor.label}</SelectItem>
                    <SelectItem value="geyserRock">{MATERIALS_DATA.geyserRock.label}</SelectItem>
                    <SelectItem value="lightSofa">{MATERIALS_DATA.lightSofa.label}</SelectItem>
                    <SelectItem value="titaniumScuffed">{MATERIALS_DATA.titaniumScuffed.label}</SelectItem>
                    <SelectItem value="wornFactorySiding">{MATERIALS_DATA.wornFactorySiding.label}</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
            </div>
        </div>
      )
    
    return (
        <Card className="absolute top-2 right-2 w-75 m-y-0">
            <CardContent>
                {selectedFaceMaterial ? cardContent : placeholder}
            </CardContent>
        </Card>
    )
}

export default MaterialSelectionCard