import addEventListener from "../../../utils/addEventListener";

const eventTypes = ["resize", "scroll", "touchstart", "touchmove", "touchend", "pageshow", "load"];
let observerEntities = [];

export const getElementRect = element => {
  return element === window ? { top: 0, bottom: window.innerHeight } : element.getBoundingClientRect();
};

export const getFixedTop = (placeholderRect, targetRect, offsetTop) => {
  if (offsetTop !== undefined && targetRect.top > placeholderRect.top - offsetTop) {
    return offsetTop + targetRect.top + "px";
  }

  return undefined;
};

export const getFixedBottom = (placeholderRect, targetRect, offsetBottom) => {
  if (offsetBottom !== undefined && targetRect.bottom < placeholderRect.bottom + offsetBottom) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;

    return offsetBottom + targetBottomOffset + "px";
  }

  return undefined;
};

export const addObserver = (target, affix) => {
  if (!target) {
    return;
  }

  let entity = observerEntities.find(oriObserverEntity => oriObserverEntity.target === target);

  if (entity) {
    entity.affixList.push(affix);
  }
  else {
    entity = {
      target,
      affixList: [affix],
      eventHandlers: {}
    };

    observerEntities.push(entity);

    eventTypes.forEach(eventType => {
      entity.eventHandlers[eventType] = addEventListener(target, eventType, () => {
        entity.affixList.forEach(target => {
          target.onLazyUpdatePosition();
        });
      });
    });
  }
};

export const removeObserver = affix => {
  const observerEntity = observerEntities.find(oriObserverEntity => {
    const hasAffix = oriObserverEntity.affixList.some(target => target === affix);

    if (hasAffix) {
      oriObserverEntity.affixList = oriObserverEntity.affixList.filter(target => target !== affix);
    }

    return hasAffix;
  });

  if (observerEntity && observerEntity.affixList.length === 0) {
    observerEntities = observerEntities.filter(oriObserverEntity => oriObserverEntity !== observerEntity);

    eventTypes.forEach(eventType => {
      const handler = observerEntity.eventHandlers[eventType];

      if (handler && handler.remove) {
        handler.remove();
      }
    });
  }
};

export default {
  getElementRect,
  getFixedTop,
  getFixedBottom,
  addObserver,
  removeObserver
};