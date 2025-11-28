import { useRef, useEffect, useCallback, useState } from 'react'
import './App.css'
import { Viewer3D } from './Viewer3D';
import { MATERIALS_DATA } from './materialsData';
import { useAppDispatch, useAppSelector } from './hooks/redux';
import MaterialSelectionCard from './MaterialSelectionCard';
import { setSelectedFaceIndex } from './store/reducers/cubeMaterialsSlice';
import { isSomething } from 'tsjam';
import { Spinner } from './components/ui/spinner';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewer3dRef = useRef<Viewer3D>(null)
  const cubeState = useAppSelector(state => state.cube)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(true)

  const onPointerdown = useCallback((e: MouseEvent) => {
    const index = viewer3dRef.current?.onPointerdown(e)
    if (isSomething(index))
      dispatch(setSelectedFaceIndex(index))
  }, [dispatch])

  useEffect(() => {
    (async () => {
      viewer3dRef.current = viewer3dRef.current || new Viewer3D(canvasRef.current!)
      await viewer3dRef.current.init(MATERIALS_DATA)
      viewer3dRef.current.setState(cubeState)
      canvasRef.current?.addEventListener('pointerdown', onPointerdown)
      setIsLoading(false)
  
      return () => {
        viewer3dRef.current?.dispose()
        viewer3dRef.current = null
        canvasRef.current?.removeEventListener('pointerdown', onPointerdown)
      }
    })()
  }, [])

  useEffect(() => {
    viewer3dRef.current?.setState(cubeState)
  }, [cubeState])

  return (
    <>
      <div className="w-full h-full relative" >
        <canvas ref={canvasRef}></canvas>
        {isLoading && <Spinner className='size-10 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'/>}
        <MaterialSelectionCard/>
      </div>
    </>
  )
}

export default App
