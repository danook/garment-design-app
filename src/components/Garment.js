import React from "react";

const sleeveAngle = 1.0;
const sleeveWidth = 60;

const initParams = {
  centerX: 300,
  centerY: 150,
  sleeveLength: 250,
  bodyLength: 250,
  shoulderWidth: 150,
  bodyWidth: 200
};

// List of configurable parts
const config = {
  none: 0,
  position: 1,
  sleeveLength: 2,
  bodyLength: 3,
  shoulderWidth: 4,
  bodyWidth: 5
};

const configConstraints = {
  sleeveLength: {
    min: 100,
    max: 300
  },
  bodyLength: {
    min: 150,
    max: 350
  },
  shoulderWidth: {
    min: 120,
    max: 250
  },
  bodyWidth: {
    min: 100,
    max: 300
  }
};

const correspondingConfigForGrip = {
  rightShoulder: config.shoulderWidth,
  leftShoulder: config.shoulderWidth,
  rightSleeveCenter: config.sleeveLength,
  leftSleeveCenter: config.sleeveLength,
  rightHem: config.bodyWidth,
  leftHem: config.bodyWidth,
  centerHem: config.bodyLength,
  bodyCenter: config.position
}

// Load image files
const gripImage = new Image();
const activatedGripImage = new Image();
const gripCenterImage = new Image();
const activatedGripCenterImage = new Image();
gripImage.src = '/images/grip.png'
activatedGripImage.src = '/images/grip_activated.png'
gripCenterImage.src = '/images/grip_center.png';
activatedGripCenterImage.src = '/images/grip_center_activated.png';

function computeVertices(params) {
  return {
    rightShoulder: {
      x: params.centerX + params.shoulderWidth / 2, 
      y: params.centerY
    },
    rightSleeveTop: {
      x: params.centerX + params.shoulderWidth / 2 + params.sleeveLength * Math.cos(sleeveAngle),
      y: params.centerY + params.sleeveLength * Math.sin(sleeveAngle)
    },
    rightSleeveBottom: {
      x: params.centerX + params.shoulderWidth / 2 + params.sleeveLength * Math.cos(sleeveAngle) - sleeveWidth * Math.sin(sleeveAngle),
      y: params.centerY + params.sleeveLength * Math.sin(sleeveAngle) + sleeveWidth * Math.cos(sleeveAngle)
    },
    rightArmpit: {
      x: params.centerX + params.shoulderWidth / 2,
      y: params.centerY + sleeveWidth / Math.cos(sleeveAngle)
    },
    rightHem: {
      x: params.centerX + params.bodyWidth / 2,
      y: params.centerY + params.bodyLength
    },
    leftHem: {
      x: params.centerX - params.bodyWidth / 2,
      y: params.centerY + params.bodyLength
    },
    leftArmpit: {
      x: params.centerX - params.shoulderWidth / 2,
      y: params.centerY + sleeveWidth / Math.cos(sleeveAngle)
    },
    leftSleeveBottom: {
      x: params.centerX - params.shoulderWidth / 2 - params.sleeveLength * Math.cos(sleeveAngle) + sleeveWidth * Math.sin(sleeveAngle),
      y: params.centerY + params.sleeveLength * Math.sin(sleeveAngle) + sleeveWidth * Math.cos(sleeveAngle)
    },
    leftSleeveTop: {
      x: params.centerX - params.shoulderWidth / 2 - params.sleeveLength * Math.cos(sleeveAngle),
      y: params.centerY + params.sleeveLength * Math.sin(sleeveAngle)
    },
    leftShoulder: {
      x: params.centerX - params.shoulderWidth / 2, 
      y: params.centerY
    }
  };
}

function computeGripPosition(params) {
  return {
    rightShoulder: {
      x: params.centerX + params.shoulderWidth / 2, 
      y: params.centerY
    },
    leftShoulder: {
      x: params.centerX - params.shoulderWidth / 2, 
      y: params.centerY
    },
    rightSleeveCenter: {
      x: params.centerX + params.shoulderWidth / 2 + params.sleeveLength * Math.cos(sleeveAngle) - sleeveWidth * Math.sin(sleeveAngle) / 2,
      y: params.centerY + params.sleeveLength * Math.sin(sleeveAngle) + sleeveWidth * Math.cos(sleeveAngle) / 2
    },
    leftSleeveCenter: {
      x: params.centerX - params.shoulderWidth / 2 - params.sleeveLength * Math.cos(sleeveAngle) + sleeveWidth * Math.sin(sleeveAngle) / 2,
      y: params.centerY + params.sleeveLength * Math.sin(sleeveAngle) + sleeveWidth * Math.cos(sleeveAngle) / 2
    },
    rightHem: {
      x: params.centerX + params.bodyWidth / 2,
      y: params.centerY + params.bodyLength
    },
    leftHem: {
      x: params.centerX - params.bodyWidth / 2,
      y: params.centerY + params.bodyLength
    },
    centerHem: {
      x: params.centerX,
      y: params.centerY + params.bodyLength,
    },
    bodyCenter: {
      x: params.centerX,
      y: params.centerY + params.bodyLength / 2
    }
  };
}

function getActivatedConfig(params, mousePos) {
  const mouseOn = p =>
     (mousePos.x - p.x) * (mousePos.x - p.x) + (mousePos.y - p.y) * (mousePos.y - p.y) < 400;
  const grips = computeGripPosition(params);
  if (mouseOn(grips.rightShoulder) || mouseOn(grips.leftShoulder)) return config.shoulderWidth;
  else if (mouseOn(grips.rightSleeveCenter) || mouseOn(grips.leftSleeveCenter)) return config.sleeveLength;
  else if (mouseOn(grips.rightHem) || mouseOn(grips.leftHem)) return config.bodyWidth;
  else if (mouseOn(grips.centerHem)) return config.bodyLength;
  else if (mouseOn(grips.bodyCenter)) return config.position;
  else return config.none;
}

function renderGarment(params, activatedConfig, canvasRef) {
  // Render outline of garment
  const vertices = computeVertices(params);
  const context = canvasRef.current.getContext('2d');
  context.clearRect(0, 0, 800, 800);
  context.lineWidth = 3;
  context.strokeStyle = "blue";
  context.beginPath();
  context.moveTo(vertices.leftShoulder.x, vertices.leftShoulder.y);
  Object.values(vertices).forEach(vertex => {
    context.lineTo(vertex.x, vertex.y);
  })
  context.closePath();
  context.stroke();

  // Render grips
  const grips = computeGripPosition(params);
  const gripImageSize = 30;

  const gripAngle = {
    rightShoulder: Math.PI / 2,
    leftShoulder: -Math.PI / 2,
    rightSleeveCenter: Math.PI / 2 + sleeveAngle,
    leftSleeveCenter: Math.PI / 2 - sleeveAngle,
    rightHem: Math.PI / 2,
    leftHem: -Math.PI / 2,
    centerHem: 0,
    bodyCenter: 0
  };

  const renderGrips = () => {
    for (const [gripName, gripPos] of Object.entries(grips)) {
      // Rotate the context to render a rotated image file
      context.save();
      context.translate(gripPos.x, gripPos.y);
      context.rotate(gripAngle[gripName]);
      context.drawImage(
        gripName === 'bodyCenter' 
        ? (correspondingConfigForGrip[gripName] === activatedConfig ? activatedGripCenterImage : gripCenterImage)
        : (correspondingConfigForGrip[gripName] === activatedConfig ? activatedGripImage : gripImage),
        -gripImageSize / 2, 
        -gripImageSize / 2, 
        gripImageSize, 
        gripImageSize
      );
      // Restore to the saved state to un-rotate the context
      context.restore();
    }
  }
  gripImage.onload = renderGrips;
  activatedGripImage.onload = renderGrips;
  gripCenterImage.onload = renderGrips;
  activatedGripCenterImage.onload = renderGrips;
  renderGrips();
}

export default function Garment({imageFile}) {
  const canvasRef = React.useRef();
  const [params, setParams] = React.useState(initParams);

  // selected: dragging, activated: mouse-hovering
  const [selectedConfig, setSelectedConfig] = React.useState(config.none);
  const [activatedConfig, setActivatedConfig] = React.useState(config.none);
  
  // Listeners
  const onMouseDown = e => {
    const mousePos = {
      x: e.clientX - canvasRef.current.getBoundingClientRect().left,
      y: e.clientY - canvasRef.current.getBoundingClientRect().top
    }; 
    const activatedConfig = getActivatedConfig(params, mousePos);
    if (activatedConfig !== config.none) {
      document.body.style.cursor = 'grabbing';
      setActivatedConfig(activatedConfig);
      setSelectedConfig(activatedConfig);
    }
  };

  const onMouseUp = _ => {
    setSelectedConfig(config.none);
    setActivatedConfig(config.none);
    document.body.style.cursor = 'auto';
  }

  const onMouseMove = e => {
    const mousePos = {
      x: e.clientX - canvasRef.current.getBoundingClientRect().left,
      y: e.clientY - canvasRef.current.getBoundingClientRect().top
    }; 
    const applyConstraint = (val, constraint) => {
      return Math.max(Math.min(val, constraint.max), constraint.min);
    }
    switch(selectedConfig) {
      case config.sleeveLength:
        const sleeveLength = 
          mousePos.x > params.centerX ?
          Math.abs(Math.cos(sleeveAngle) * (mousePos.x - params.shoulderWidth / 2 - params.centerX) + Math.sin(sleeveAngle) * (mousePos.y - params.centerY)) :
          Math.abs(Math.cos(sleeveAngle) * (-mousePos.x - params.shoulderWidth / 2 + params.centerX) + Math.sin(sleeveAngle) * (mousePos.y - params.centerY));
        setParams({
          ...params, 
          sleeveLength: applyConstraint(sleeveLength, configConstraints.sleeveLength)
        });
        break;
      case config.shoulderWidth:
        setParams({
          ...params,
          shoulderWidth: applyConstraint(Math.abs(mousePos.x - params.centerX) * 2, configConstraints.shoulderWidth)
        });
        break;
      case config.bodyWidth:
        setParams({
          ...params,
          bodyWidth: applyConstraint(Math.abs(mousePos.x - params.centerX) * 2, configConstraints.bodyWidth)
        });
        break;
      case config.bodyLength:
        setParams({
          ...params,
          bodyLength: applyConstraint(mousePos.y - params.centerY, configConstraints.bodyLength)
        });
        break;
      case config.position:
        setParams({
          ...params,
          centerX: mousePos.x,
          centerY: mousePos.y - params.bodyLength / 2
        });
        break;
      case config.none:
        const activatedConfig = getActivatedConfig(params, mousePos);
        if (activatedConfig !== config.none) {
          document.body.style.cursor = 'grab';
          setActivatedConfig(activatedConfig);
        } else {
          document.body.style.cursor = 'auto';
          setActivatedConfig(config.none);
        }
    }
  }

  // Update the garment when pos is updated
  React.useEffect(() => {
    if (!canvasRef.current) return;
    renderGarment(params, activatedConfig, canvasRef);
  }, [params, activatedConfig]);

  return (
    <div 
      style={{
        backgroundImage: `url(${imageFile})`, 
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        width: 'fit-content'
        }}>
      <canvas 
        ref={canvasRef} 
        onMouseDown={onMouseDown} 
        onMouseUp={onMouseUp} 
        onMouseMove={onMouseMove}
        width={800} 
        height={800}/>
    </div>
  )
}