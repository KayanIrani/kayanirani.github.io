import { Bone, BoxGeometry, Color, Float32BufferAttribute, MeshStandardMaterial, Skeleton, SkeletonHelper, SkinnedMesh, SRGBColorSpace, Uint16BufferAttribute, Vector3 } from "three";
import {pages} from "./DiaryUI";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCursor, useHelper, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { degToRad, lerp } from "three/src/math/MathUtils.js";
import { easing } from "maath";
import { useBookStore } from "../../../store/store.js";


// const lerpFactor = 0.05;
const easingFactor = 0.5;
const easingFactorFold = 0.3;

// inscreasing insideCurveStrength will increase the curve moreeee back
const insideCurveStrength = 0.14;
const outsideCurveStrength = 0.05;
const turningCurveStrength = 0.09;

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS= 30; // number on bones
const SEGMENT_HEIGHT = 2;
const SEGMENT_WIDTH = PAGE_WIDTH/ PAGE_SEGMENTS 

const pageGeometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    SEGMENT_HEIGHT
)


// TO NOT BE CENTERED BUT AT THE LEFT
pageGeometry.translate(PAGE_WIDTH/2,0,0)

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];  //bones
const skinWeights = []; // weight for bones meaning importance on mesh geom

for (let i=0;i<position.count ; i++){
    // ALL VERTICES
    vertex.fromBufferAttribute(position,i) // get the vertex 
    const x = vertex.x;

    const skinIndex = Math.max(0,Math.floor(x/SEGMENT_WIDTH)) // calculate the skin index
    let skinWeight = (x% SEGMENT_WIDTH)/SEGMENT_WIDTH // calculate the skin weight

    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0); // set the skin indexes
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0); // set the skin weights
}

pageGeometry.setAttribute(
    "skinIndex",
    new Uint16BufferAttribute(skinIndexes,4)
)

pageGeometry.setAttribute(
    "skinWeight",
    new Float32BufferAttribute(skinWeights,4)
)


const whiteColor = new Color("white")
const emissiveColor = new Color("orange")

// it has 6 faces since it is a box which is very thin
const pageMaterials = [
    new MeshStandardMaterial({
        color: whiteColor,
    }),
    new MeshStandardMaterial({
        color: "#111",
    }),
    new MeshStandardMaterial({
        color: whiteColor,
    }),
    new MeshStandardMaterial({
        color: whiteColor,
    }),

    // WILL BE CREATED FOR EACH PAGE 
    // new MeshStandardMaterial({
    //     color: "pink",
    // }),
    // new MeshStandardMaterial({
    //     color: "blue",
    // }),
];

pages.forEach((page)=>{
    useTexture.preload(`/textures/${page.front}.jpg`);
    useTexture.preload(`/textures/${page.back}.jpg`);
})

useTexture.preload('/textures/book-cover-roughness.jpg')

const Page = ({number, page, front , back, bookOpened , bookClosed , ...props}) =>{
    const group = useRef()
    const skinnedMeshRef = useRef()
    const turnedAt = useRef(0)
    const lastOpened = useRef(bookOpened)


    const [picture,picture2,pictureRoughness] = useTexture([
        `/textures/${front}.jpg`,
        `/textures/${back}.jpg`,
        ...(number === 0 || number === pages.length -1 
            ?[`/textures/book-cover-roughness.jpg`]
            :[]
        ),
    ])

    picture.colorSpace = picture2.colorSpace = SRGBColorSpace;

    const manualSkinnedMesh = useMemo(()=>{
        const bones = [];
        for (let i=0; i<=PAGE_SEGMENTS;i++){
            let bone = new Bone();
            bones.push(bone)
            if (i===0){
                bone.position.x = 0
            }
            else{
                bone.position.x = SEGMENT_WIDTH
            }
            if (i>0){
                bones[i-1].add(bone) // attach the new bone to the previous bone
            }
        }
        const skeleton = new Skeleton(bones);

        const materials = [...pageMaterials,
            new MeshStandardMaterial({
                color: whiteColor,
                map: picture,
                ...(number===0
                    ?{
                        roughnessMap: pictureRoughness
                    }
                    :{
                        // matt effect 1 and glossy effect 0.1
                        roughness: 0.1,
                    }
                ),
                emissive: emissiveColor,
                emissiveIntensity: 0,

            }),
            new MeshStandardMaterial({
                color: whiteColor,
                // back picture of the page
                map: picture2,
                ...(number=== pages.length -1
                    ?{
                        roughnessMap: pictureRoughness
                    }
                    :{
                        // matt effect 1 and glossy effect 0.1
                        roughness: 0.1,
                    }
                ),
                emissive: emissiveColor,
                emissiveIntensity: 0,
            })
        ];
        const mesh = new SkinnedMesh(pageGeometry,materials)
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.frustumCulled = false;
        mesh.add(skeleton.bones[0]);
        mesh.bind(skeleton)

        return  mesh
    },[]);

    // useHelper(skinnedMeshRef,SkeletonHelper,"red")
    useFrame((_, delta)=>{
        if (!skinnedMeshRef.current) {
            return;
        }

        const emissiveIntensity = highlighted ? 0.22:0;
        skinnedMeshRef.current.material[4].emissiveIntensity = skinnedMeshRef.current.material[5].emissiveIntensity = lerp(
            skinnedMeshRef.current.material[4].emissiveIntensity,
            emissiveIntensity,
            0.1
        );
        if (lastOpened.current !== bookOpened){
            turnedAt.current =  +new Date() // +new changes and return the primitive value of that object at that time valueOf or toString of the class definition
            lastOpened.current = bookOpened
        }
        let turningTime = Math.min(400, new Date() - turnedAt.current) / 400;
        turningTime = Math.sin(turningTime * Math.PI);

        let targetRotation = bookOpened ? -Math.PI/2 :Math.PI/2 

        
        if (!bookClosed){
            targetRotation+= degToRad(number* 0.8)
        }
        const bones = skinnedMeshRef.current.skeleton.bones;
        // bones[0].rotation.y = lerp(bones[0].rotation.y,targetRotation,lerpFactor);

        for (let i=0;i<bones.length;i++){
            const target = i === 0 ? group.current : bones[i]


            // sin(i*0.2 +0.25) => sin(Ax + b) if u increase b then curve will go more behind and A just helps with how curvy each bone is relatively
            const insideCurveIntensity = i<8 ? Math.sin(i*0.2 + 0.40) : 0;
            const outsideCurveIntensity = i>=8? Math.cos(i*0.3 + 0.09) : 0; 
            const turningIntensity = Math.sin(i * Math.PI * (1/bones.length)) * turningTime
            let rotationAngle = 
            insideCurveStrength * insideCurveIntensity * targetRotation 
            - outsideCurveStrength * outsideCurveIntensity * targetRotation
            + turningCurveStrength * turningIntensity * targetRotation

            let foldRotationAngle = degToRad(Math.sign(targetRotation)*2)
            if (bookClosed){
                if (i===0){
                    rotationAngle = targetRotation;
                    foldRotationAngle = 0
                }
                else{
                    rotationAngle = 0
                }
            }
            easing.dampAngle(
                target.rotation,
                "y",
                rotationAngle,
                easingFactor,
                delta
            );

            const foldIntensity =
                i > 8
                ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
                : 0;
            easing.dampAngle(
                target.rotation,
                "x",
                foldRotationAngle * foldIntensity,
                easingFactorFold,
                delta
            );
        }
    })
    const setPage = useBookStore((state) => state.setPage)

    const [highlighted, setHighlighted] = useState(false);
    useCursor(highlighted);
    return (
        <group {...props} 
            onPointerEnter={(e)=>{
                e.stopPropagation();
                setHighlighted(true)
            }}
            onPointerLeave={(e)=>{
                e.stopPropagation();
                setHighlighted(false)
            }}
            onClick={(e)=>{
                e.stopPropagation();
                setPage(bookOpened?number:number+1)
                setHighlighted(false)
            }}
            ref={group}
        >
            <primitive object={manualSkinnedMesh} ref={skinnedMeshRef}
                position-z={-number*PAGE_DEPTH + page * PAGE_DEPTH}
            />

        </group>
    )
}

export const Book = ({...props}) =>{
    const page = useBookStore((state)=>state.page)
    const [delayedPage, setDelayedPage] = useState(page)
    const bookRef = useRef()
    useFrame((_, delta) => {
        if (!bookRef.current) return
        const closed = delayedPage === 0 || delayedPage === pages.length
        const target = closed ? -Math.PI / 2 : -Math.PI / 2 - Math.PI / 12
        easing.dampAngle(bookRef.current.rotation, "y", target, 0.5, delta)
    })
    useEffect(()=>{
        let timeout;
        const goToPage = () =>{
            setDelayedPage((delayedPage)=>{
                if (page===delayedPage){
                    return delayedPage;
                }
                else{
                    timeout = setTimeout(
                        () => {
                        goToPage();
                    }, Math.abs(page-delayedPage)>2 ? 50 : 150);
                }
                if (page>delayedPage){
                    return delayedPage+1
                }
                if (page<delayedPage){
                    return delayedPage-1
                }
            })
        };
        goToPage();
        return () =>{
            clearTimeout(timeout)
        }

    },[page])
    return (
        <group 
        ref={bookRef}
        rotation-x={-Math.PI/2} 
        rotation-y={(delayedPage === 0 || delayedPage === pages.length) ?-Math.PI/2: -Math.PI/2-Math.PI/12} 
        {...props}>
            {
                [...pages].map((pageData, index)=>(
                    <Page 
                    page={delayedPage}
                    key={index} number={index} 
                    bookOpened={delayedPage>index}
                    bookClosed={delayedPage === 0 || delayedPage === pages.length}
                    {...pageData} 
                    />
                ))
            }
        </group>
    )
}
