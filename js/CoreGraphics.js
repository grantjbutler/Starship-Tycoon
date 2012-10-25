// CoreGraphics from Cappuccino
// http://github.com/cappuccino/cappuccino

// Cappuccino Constants

ABS     = Math.abs;

ASIN    = Math.asin;
ACOS    = Math.acos;
ATAN    = Math.atan;
ATAN2   = Math.atan2;
SIN     = Math.sin;
COS     = Math.cos;
TAN     = Math.tan;

EXP     = Math.exp;
POW     = Math.pow;

CEIL    = Math.ceil;
FLOOR   = Math.floor;
ROUND   = Math.round;

MIN     = Math.min;
MAX     = Math.max;

RAND    = Math.random;
SQRT    = Math.sqrt;

E       = Math.E;
LN2     = Math.LN2;
LN10    = Math.LN10;
LOG     = Math.log;
LOG2E   = Math.LOG2E;
LOG10E  = Math.LOG10E;

PI      = Math.PI;
PI2     = Math.PI * 2.0;
PI_2    = Math.PI / 2.0;

SQRT1_2 = Math.SQRT1_2;
SQRT2   = Math.SQRT2;

CPUnknownBrowserEngine = 0;
CPGeckoBrowserEngine = 1;
CPInternetExplorerBrowserEngine = 2;
CPKHTMLBrowserEngine = 3;
CPOperaBrowserEngine = 4;
CPWebKitBrowserEngine = 5;
CPMacOperatingSystem = 0;
CPWindowsOperatingSystem = 1;
CPOtherOperatingSystem = 2;
CPCSSRGBAFeature = 1 << 5;
CPHTMLCanvasFeature = 1 << 6;
CPHTMLContentEditableFeature = 1 << 7;
CPHTMLDragAndDropFeature = 1 << 8;
CPJavaScriptInnerTextFeature = 1 << 9;
CPJavaScriptTextContentFeature = 1 << 10;
CPJavaScriptClipboardEventsFeature = 1 << 11;
CPJavaScriptClipboardAccessFeature = 1 << 12;
CPJavaScriptCanvasDrawFeature = 1 << 13;
CPJavaScriptCanvasTransformFeature = 1 << 14;
CPVMLFeature = 1 << 15;
CPJavaScriptRemedialKeySupport = 1 << 16;
CPJavaScriptShadowFeature = 1 << 20;
CPJavaScriptNegativeMouseWheelValues = 1 << 22;
CPJavaScriptMouseWheelValues_8_15 = 1 << 23;
CPOpacityRequiresFilterFeature = 1 << 24;
CPInputTypeCanBeChangedFeature = 1 << 25;
CPHTML5DragAndDropSourceYOffBy1 = 1 << 26;
CPSOPDisabledFromFileURLs = 1 << 27;
CPInputSetFontOutsideOfDOM = 1 << 28;
CPInput1PxLeftPadding = 1 << 29;
CPInputOnInputEventFeature = 1 << 30;
CPCanvasParentDrawErrorsOnMovementBug = 1 << 0;
var USER_AGENT = "",
    PLATFORM_ENGINE = CPUnknownBrowserEngine,
    PLATFORM_FEATURES = 0,
    PLATFORM_BUGS = 0;
PLATFORM_FEATURES |= CPInputTypeCanBeChangedFeature;
PLATFORM_FEATURES |= CPInputSetFontOutsideOfDOM;
if (typeof window !== "undefined" && typeof window.navigator !== "undefined")
    USER_AGENT = window.navigator.userAgent;
if (typeof window !== "undefined" && window.opera)
{
    PLATFORM_ENGINE = CPOperaBrowserEngine;
    PLATFORM_FEATURES |= CPJavaScriptCanvasDrawFeature;
}
else if (typeof window !== "undefined" && window.attachEvent)
{
    PLATFORM_ENGINE = CPInternetExplorerBrowserEngine;
    PLATFORM_FEATURES |= CPVMLFeature;
    PLATFORM_FEATURES |= CPJavaScriptRemedialKeySupport;
    PLATFORM_FEATURES |= CPJavaScriptShadowFeature;
    PLATFORM_FEATURES |= CPOpacityRequiresFilterFeature;
    PLATFORM_FEATURES &= ~CPInputTypeCanBeChangedFeature;
    PLATFORM_FEATURES &= ~CPInputSetFontOutsideOfDOM;
}
else if (USER_AGENT.indexOf("AppleWebKit/") != -1)
{
    PLATFORM_ENGINE = CPWebKitBrowserEngine;
    PLATFORM_FEATURES |= CPCSSRGBAFeature;
    PLATFORM_FEATURES |= CPHTMLContentEditableFeature;
    if (USER_AGENT.indexOf("Chrome") === -1)
        PLATFORM_FEATURES |= CPHTMLDragAndDropFeature;
    PLATFORM_FEATURES |= CPJavaScriptClipboardEventsFeature;
    PLATFORM_FEATURES |= CPJavaScriptClipboardAccessFeature;
    PLATFORM_FEATURES |= CPJavaScriptShadowFeature;
    var versionStart = USER_AGENT.indexOf("AppleWebKit/") + "AppleWebKit/".length,
        versionEnd = USER_AGENT.indexOf(" ", versionStart),
        versionString = USER_AGENT.substring(versionStart, versionEnd),
        versionDivision = versionString.indexOf('.'),
        majorVersion = parseInt(versionString.substring(0, versionDivision)),
        minorVersion = parseInt(versionString.substr(versionDivision + 1));
    if ((USER_AGENT.indexOf("Safari") !== -1 && (majorVersion > 525 || (majorVersion === 525 && minorVersion > 14))) || USER_AGENT.indexOf("Chrome") !== -1)
        PLATFORM_FEATURES |= CPJavaScriptRemedialKeySupport;
    if (majorVersion < 532 || (majorVersion === 532 && minorVersion < 6))
        PLATFORM_FEATURES |= CPHTML5DragAndDropSourceYOffBy1;
    if (majorVersion < 537)
        PLATFORM_FEATURES |= CPInput1PxLeftPadding;
    if (USER_AGENT.indexOf("Chrome") === -1)
        PLATFORM_FEATURES |= CPSOPDisabledFromFileURLs;
    if (majorVersion > 533)
        PLATFORM_BUGS |= CPCanvasParentDrawErrorsOnMovementBug;
}
else if (USER_AGENT.indexOf("KHTML") != -1)
{
    PLATFORM_ENGINE = CPKHTMLBrowserEngine;
}
else if (USER_AGENT.indexOf("Gecko") !== -1)
{
    PLATFORM_ENGINE = CPGeckoBrowserEngine;
    PLATFORM_FEATURES |= CPJavaScriptCanvasDrawFeature;
    var index = USER_AGENT.indexOf("Firefox"),
        version = (index === -1) ? 2.0 : parseFloat(USER_AGENT.substring(index + "Firefox".length + 1));
    if (version >= 3.0)
        PLATFORM_FEATURES |= CPCSSRGBAFeature;
    if (version < 3.0)
        PLATFORM_FEATURES |= CPJavaScriptMouseWheelValues_8_15;
    PLATFORM_FEATURES |= CPInput1PxLeftPadding;
}
if (typeof document != "undefined")
{
    var canvasElement = document.createElement("canvas");
    if (canvasElement && canvasElement.getContext)
    {
        PLATFORM_FEATURES |= CPHTMLCanvasFeature;
        var context = document.createElement("canvas").getContext("2d");
        if (context && context.setTransform && context.transform)
            PLATFORM_FEATURES |= CPJavaScriptCanvasTransformFeature;
    }
    var DOMElement = document.createElement("div");
    if (DOMElement.innerText != undefined)
        PLATFORM_FEATURES |= CPJavaScriptInnerTextFeature;
    else if (DOMElement.textContent != undefined)
        PLATFORM_FEATURES |= CPJavaScriptTextContentFeature;
    var DOMInputElement = document.createElement("input");
    if ("oninput" in DOMInputElement)
        PLATFORM_FEATURES |= CPInputOnInputEventFeature;
    else if (typeof DOMInputElement.setAttribute === "function")
    {
        DOMInputElement.setAttribute("oninput", "return;");
        if (typeof DOMInputElement.oninput === "function")
            PLATFORM_FEATURES |= CPInputOnInputEventFeature;
    }
}
function CPFeatureIsCompatible(aFeature)
{
    return PLATFORM_FEATURES & aFeature;
}
function CPPlatformHasBug(aBug)
{
    return PLATFORM_BUGS & aBug;
}
function CPBrowserIsEngine(anEngine)
{
    return PLATFORM_ENGINE === anEngine;
}
function CPBrowserIsOperatingSystem(anOperatingSystem)
{
    return OPERATING_SYSTEM === anOperatingSystem;
}
OPERATING_SYSTEM = CPOtherOperatingSystem;
if (USER_AGENT.indexOf("Mac") !== -1)
{
    OPERATING_SYSTEM = CPMacOperatingSystem;
}
else
{
    if (USER_AGENT.indexOf("Windows") !== -1)
        OPERATING_SYSTEM = CPWindowsOperatingSystem;
}

// CGGeometry.js

function CGPointMake(x, y) { return { x:x, y:y }; }
function CGPointMakeZero() { return { x:0.0, y:0.0 }; }
function CGPointMakeCopy(aPoint) { return { x:aPoint.x, y:aPoint.y }; }
function CGPointCreateCopy(aPoint) { return { x:aPoint.x, y:aPoint.y }; }
function CGPointEqualToPoint(lhsPoint, rhsPoint) { return (lhsPoint.x == rhsPoint.x && lhsPoint.y == rhsPoint.y); }
function CGStringFromPoint(aPoint) { return ("{" + aPoint.x + ", " + aPoint.y + "}"); }
function CGSizeMake(width, height) { return { width:width, height:height }; }
function CGSizeMakeZero() { return { width:0.0, height:0.0 }; }
function CGSizeMakeCopy(aSize) { return { width:aSize.width, height:aSize.height }; }
function CGSizeCreateCopy(aSize) { return { width:aSize.width, height:aSize.height }; }
function CGSizeEqualToSize(lhsSize, rhsSize) { return (lhsSize.width == rhsSize.width && lhsSize.height == rhsSize.height); }
function CGStringFromSize(aSize) { return ("{" + aSize.width + ", " + aSize.height + "}"); }
function CGRectMake(x, y, width, height) { return { origin: { x:x, y:y }, size: { width:width, height:height } }; }
function CGRectMakeZero() { return { origin: { x:0.0, y:0.0 }, size: { width:0.0, height:0.0 } }; }
function CGRectMakeCopy(aRect) { return { origin: { x:aRect.origin.x, y:aRect.origin.y }, size: { width:aRect.size.width, height:aRect.size.height } }; }
function CGRectCreateCopy(aRect) { return { origin: { x:aRect.origin.x, y:aRect.origin.y }, size: { width:aRect.size.width, height:aRect.size.height } }; }
function CGRectEqualToRect(lhsRect, rhsRect) { return ((lhsRect.origin.x == rhsRect.origin.x && lhsRect.origin.y == rhsRect.origin.y) && (lhsRect.size.width == rhsRect.size.width && lhsRect.size.height == rhsRect.size.height)); }
function CGStringFromRect(aRect) { return ("{" + ("{" + aRect.origin.x + ", " + aRect.origin.y + "}") + ", " + ("{" + aRect.size.width + ", " + aRect.size.height + "}") + "}"); }
function CGRectOffset(aRect, dX, dY) { return { origin: { x:aRect.origin.x + dX, y:aRect.origin.y + dY }, size: { width:aRect.size.width, height:aRect.size.height } }; }
function CGRectInset(aRect, dX, dY) { return { origin: { x:aRect.origin.x + dX, y:aRect.origin.y + dY }, size: { width:aRect.size.width - 2 * dX, height:aRect.size.height - 2 * dY } }; }
function CGRectGetHeight(aRect) { return (aRect.size.height); }
function CGRectGetMaxX(aRect) { return (aRect.origin.x + aRect.size.width); }
function CGRectGetMaxY(aRect) { return (aRect.origin.y + aRect.size.height); }
function CGRectGetMidX(aRect) { return (aRect.origin.x + (aRect.size.width) / 2.0); }
function CGRectGetMidY(aRect) { return (aRect.origin.y + (aRect.size.height) / 2.0); }
function CGRectGetMinX(aRect) { return (aRect.origin.x); }
function CGRectGetMinY(aRect) { return (aRect.origin.y); }
function CGRectGetWidth(aRect) { return (aRect.size.width); }
function CGRectIsEmpty(aRect) { return (aRect.size.width <= 0.0 || aRect.size.height <= 0.0); }
function CGRectIsNull(aRect) { return (aRect.size.width <= 0.0 || aRect.size.height <= 0.0); }
function CGRectContainsPoint(aRect, aPoint) { return (aPoint.x >= (aRect.origin.x) && aPoint.y >= (aRect.origin.y) && aPoint.x < (aRect.origin.x + aRect.size.width) && aPoint.y < (aRect.origin.y + aRect.size.height)); }
function CGInsetMake(top, right, bottom, left) { return { top:(top), right:(right), bottom:(bottom), left:(left) }; }
function CGInsetMakeZero() { return { top:(0), right:(0), bottom:(0), left:(0) }; }
function CGInsetMakeCopy(anInset) { return { top:(anInset.top), right:(anInset.right), bottom:(anInset.bottom), left:(anInset.left) }; }
function CGInsetMakeInvertedCopy(anInset) { return { top:(-anInset.top), right:(-anInset.right), bottom:(-anInset.bottom), left:(-anInset.left) }; }
function CGInsetIsEmpty(anInset) { return ((anInset).top === 0 && (anInset).right === 0 && (anInset).bottom === 0 && (anInset).left === 0); }
function CGInsetEqualToInset(lhsInset, rhsInset) { return ((lhsInset).top === (rhsInset).top && (lhsInset).right === (rhsInset).right && (lhsInset).bottom === (rhsInset).bottom && (lhsInset).left === (rhsInset).left); }
CGMinXEdge = 0;
CGMinYEdge = 1;
CGMaxXEdge = 2;
CGMaxYEdge = 3;
CGRectNull = { origin: { x:Infinity, y:Infinity }, size: { width:0.0, height:0.0 } };
function CGRectDivide(inRect, slice, rem, amount, edge)
{
    slice.origin = { x:inRect.origin.x, y:inRect.origin.y };
    slice.size = { width:inRect.size.width, height:inRect.size.height };
    rem.origin = { x:inRect.origin.x, y:inRect.origin.y };
    rem.size = { width:inRect.size.width, height:inRect.size.height };
    switch (edge)
    {
        case CGMinXEdge:
            slice.size.width = amount;
            rem.origin.x += amount;
            rem.size.width -= amount;
            break;
        case CGMaxXEdge:
            slice.origin.x = (slice.origin.x + slice.size.width) - amount;
            slice.size.width = amount;
            rem.size.width -= amount;
            break;
        case CGMinYEdge:
            slice.size.height = amount;
            rem.origin.y += amount;
            rem.size.height -= amount;
            break;
        case CGMaxYEdge:
            slice.origin.y = (slice.origin.y + slice.size.height) - amount;
            slice.size.height = amount;
            rem.size.height -= amount;
    }
}
function CGRectContainsRect(lhsRect, rhsRect)
{
    var union = CGRectUnion(lhsRect, rhsRect);
    return ((union.origin.x == lhsRect.origin.x && union.origin.y == lhsRect.origin.y) && (union.size.width == lhsRect.size.width && union.size.height == lhsRect.size.height));
}
function CGRectIntersectsRect(lhsRect, rhsRect)
{
    var intersection = CGRectIntersection(lhsRect, rhsRect);
    return !(intersection.size.width <= 0.0 || intersection.size.height <= 0.0);
}
function CGRectIntegral(aRect)
{
    aRect = CGRectStandardize(aRect);
    var x = FLOOR((aRect.origin.x)),
        y = FLOOR((aRect.origin.y));
    aRect.size.width = CEIL((aRect.origin.x + aRect.size.width)) - x;
    aRect.size.height = CEIL((aRect.origin.y + aRect.size.height)) - y;
    aRect.origin.x = x;
    aRect.origin.y = y;
    return aRect;
}
function CGRectIntersection(lhsRect, rhsRect)
{
    var intersection = { origin: { x:MAX((lhsRect.origin.x), (rhsRect.origin.x)), y:MAX((lhsRect.origin.y), (rhsRect.origin.y)) }, size: { width:0, height:0 } };
    intersection.size.width = MIN((lhsRect.origin.x + lhsRect.size.width), (rhsRect.origin.x + rhsRect.size.width)) - (intersection.origin.x);
    intersection.size.height = MIN((lhsRect.origin.y + lhsRect.size.height), (rhsRect.origin.y + rhsRect.size.height)) - (intersection.origin.y);
    return (intersection.size.width <= 0.0 || intersection.size.height <= 0.0) ? { origin: { x:0.0, y:0.0 }, size: { width:0.0, height:0.0 } } : intersection;
}
function CGRectStandardize(aRect)
{
    var width = (aRect.size.width),
        height = (aRect.size.height),
        standardized = { origin: { x:aRect.origin.x, y:aRect.origin.y }, size: { width:aRect.size.width, height:aRect.size.height } };
    if (width < 0.0)
    {
        standardized.origin.x += width;
        standardized.size.width = -width;
    }
    if (height < 0.0)
    {
        standardized.origin.y += height;
        standardized.size.height = -height;
    }
    return standardized;
}
function CGRectUnion(lhsRect, rhsRect)
{
    var lhsRectIsNull = !lhsRect || lhsRect === CGRectNull,
        rhsRectIsNull = !rhsRect || rhsRect === CGRectNull;
    if (lhsRectIsNull)
        return rhsRectIsNull ? CGRectNull : rhsRect;
    if (rhsRectIsNull)
        return lhsRectIsNull ? CGRectNull : lhsRect;
    var minX = MIN((lhsRect.origin.x), (rhsRect.origin.x)),
        minY = MIN((lhsRect.origin.y), (rhsRect.origin.y)),
        maxX = MAX((lhsRect.origin.x + lhsRect.size.width), (rhsRect.origin.x + rhsRect.size.width)),
        maxY = MAX((lhsRect.origin.y + lhsRect.size.height), (rhsRect.origin.y + rhsRect.size.height));
    return { origin: { x:minX, y:minY }, size: { width:maxX - minX, height:maxY - minY } };
}
function CGRectInsetByInset(aRect, anInset) { return { origin: { x:(aRect).origin.x + (anInset).left, y:(aRect).origin.y + (anInset).top }, size: { width:(aRect).size.width - (anInset).left - (anInset).right, height:(aRect).size.height - (anInset).top - (anInset).bottom } }; };
function CGPointFromString(aString)
{
    var comma = aString.indexOf(',');
    return { x:parseFloat(aString.substr(1, comma - 1)), y:parseFloat(aString.substring(comma + 1, aString.length)) };
}
function CGSizeFromString(aString)
{
    var comma = aString.indexOf(',');
    return { width:parseFloat(aString.substr(1, comma - 1)), height:parseFloat(aString.substring(comma + 1, aString.length)) };
}
function CGRectFromString(aString)
{
    var comma = aString.indexOf(',', aString.indexOf(',') + 1);
    return { origin:CGPointFromString(aString.substr(1, comma - 1)), size:CGSizeFromString(aString.substring(comma + 2, aString.length)) };
}
function CGPointFromEvent(anEvent)
{
    return { x:anEvent.clientX, y:anEvent.clientY };
}
function CGInsetUnion(lhsInset, rhsInset)
{
    return { top:(lhsInset.top + rhsInset.top), right:(lhsInset.right + rhsInset.right), bottom:(lhsInset.bottom + rhsInset.bottom), left:(lhsInset.left + rhsInset.left) };
}
function CGInsetDifference(lhsInset, rhsInset)
{
    return { top:(lhsInset.top - rhsInset.top), right:(lhsInset.right - rhsInset.right), bottom:(lhsInset.bottom - rhsInset.bottom), left:(lhsInset.left - rhsInset.left) };
}
function CGInsetFromString(aString)
{
    var numbers = aString.substr(1, aString.length - 2).split(',');
    return { top:(parseFloat(numbers[0])), right:(parseFloat(numbers[1])), bottom:(parseFloat(numbers[2])), left:(parseFloat(numbers[3])) };
}
CGInsetFromCPString = CGInsetFromString;
function CPStringFromCGInset(anInset)
{
    return '{' + anInset.top + ", " + anInset.left + ", " + anInset.bottom + ", " + anInset.right + '}';
}

// CGAffineTransform.js

function CGAffineTransformMake(a, b, c, d, tx, ty) { return { a:a, b:b, c:c, d:d, tx:tx, ty:ty }; }
function CGAffineTransformMakeIdentity() { return { a:1.0, b:0.0, c:0.0, d:1.0, tx:0.0, ty:0.0 }; }
function CGAffineTransformMakeCopy(anAffineTransform) { return { a:anAffineTransform.a, b:anAffineTransform.b, c:anAffineTransform.c, d:anAffineTransform.d, tx:anAffineTransform.tx, ty:anAffineTransform.ty }; }
function CGAffineTransformMakeScale(sx, sy) { return { a:sx, b:0.0, c:0.0, d:sy, tx:0.0, ty:0.0 }; }
function CGAffineTransformMakeTranslation(tx, ty) { return { a:1.0, b:0.0, c:0.0, d:1.0, tx:tx, ty:ty }; }
function CGAffineTransformTranslate(aTransform, tx, ty) { return { a:aTransform.a, b:aTransform.b, c:aTransform.c, d:aTransform.d, tx:aTransform.tx + aTransform.a * tx + aTransform.c * ty, ty:aTransform.ty + aTransform.b * tx + aTransform.d * ty }; }
function CGAffineTransformScale(aTransform, sx, sy) { return { a:aTransform.a * sx, b:aTransform.b * sx, c:aTransform.c * sy, d:aTransform.d * sy, tx:aTransform.tx, ty:aTransform.ty }; }
function CGAffineTransformConcat(lhs, rhs) { return { a:lhs.a * rhs.a + lhs.b * rhs.c, b:lhs.a * rhs.b + lhs.b * rhs.d, c:lhs.c * rhs.a + lhs.d * rhs.c, d:lhs.c * rhs.b + lhs.d * rhs.d, tx:lhs.tx * rhs.a + lhs.ty * rhs.c + rhs.tx, ty:lhs.tx * rhs.b + lhs.ty * rhs.d + rhs.ty }; }
function CGPointApplyAffineTransform(aPoint, aTransform) { return { x:aPoint.x * aTransform.a + aPoint.y * aTransform.c + aTransform.tx, y:aPoint.x * aTransform.b + aPoint.y * aTransform.d + aTransform.ty }; }
function CGSizeApplyAffineTransform(aSize, aTransform) { return { width:aSize.width * aTransform.a + aSize.height * aTransform.c, height:aSize.width * aTransform.b + aSize.height * aTransform.d }; }
function CGAffineTransformIsIdentity(aTransform) { return (aTransform.a == 1 && aTransform.b == 0 && aTransform.c == 0 && aTransform.d == 1 && aTransform.tx == 0 && aTransform.ty == 0); }
function CGAffineTransformEqualToTransform(lhs, rhs) { return (lhs.a == rhs.a && lhs.b == rhs.b && lhs.c == rhs.c && lhs.d == rhs.d && lhs.tx == rhs.tx && lhs.ty == rhs.ty); }
function CGStringCreateWithCGAffineTransform(aTransform) { return (" [[ " + aTransform.a + ", " + aTransform.b + ", 0 ], [ " + aTransform.c + ", " + aTransform.d + ", 0 ], [ " + aTransform.tx + ", " + aTransform.ty + ", 1]]"); }
function CGAffineTransformCreateCopy(aTransform)
{
    return { a:aTransform.a, b:aTransform.b, c:aTransform.c, d:aTransform.d, tx:aTransform.tx, ty:aTransform.ty };
}
function CGAffineTransformMakeRotation(anAngle)
{
    var sin = SIN(anAngle),
        cos = COS(anAngle);
    return { a:cos, b:sin, c:-sin, d:cos, tx:0.0, ty:0.0 };
}
function CGAffineTransformRotate(aTransform, anAngle)
{
    var sin = SIN(anAngle),
        cos = COS(anAngle);
    return {
            a:aTransform.a * cos + aTransform.c * sin,
            b:aTransform.b * cos + aTransform.d * sin,
            c:aTransform.c * cos - aTransform.a * sin,
            d:aTransform.d * cos - aTransform.b * sin,
            tx:aTransform.tx,
            ty:aTransform.ty
        };
}
function CGAffineTransformInvert(aTransform)
{
    var determinant = 1 / (aTransform.a * aTransform.d - aTransform.b * aTransform.c);
    return {
        a:determinant * aTransform.d,
        b:-determinant * aTransform.b,
        c:-determinant * aTransform.c,
        d:determinant * aTransform.a,
        tx:determinant * (aTransform.c * aTransform.ty - aTransform.d * aTransform.tx),
        ty:determinant * (aTransform.b * aTransform.tx - aTransform.a * aTransform.ty)
    };
}
function CGRectApplyAffineTransform(aRect, anAffineTransform)
{
    var top = (aRect.origin.y),
        left = (aRect.origin.x),
        right = (aRect.origin.x + aRect.size.width),
        bottom = (aRect.origin.y + aRect.size.height),
        topLeft = CGPointApplyAffineTransform({ x:left, y:top }, anAffineTransform),
        topRight = CGPointApplyAffineTransform({ x:right, y:top }, anAffineTransform),
        bottomLeft = CGPointApplyAffineTransform({ x:left, y:bottom }, anAffineTransform),
        bottomRight = CGPointApplyAffineTransform({ x:right, y:bottom }, anAffineTransform),
        minX = MIN(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x),
        maxX = MAX(topLeft.x, topRight.x, bottomLeft.x, bottomRight.x),
        minY = MIN(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y),
        maxY = MAX(topLeft.y, topRight.y, bottomLeft.y, bottomRight.y);
    return { origin: { x:minX, y:minY }, size: { width:(maxX - minX), height:(maxY - minY) } };
}
function CPStringFromCGAffineTransform(anAffineTransform)
{
    return '{' + anAffineTransform.a + ", " + anAffineTransform.b + ", " + anAffineTransform.c + ", " + anAffineTransform.d + ", " + anAffineTransform.tx + ", " + anAffineTransform.ty + '}';
}

// CGColorSpace.js

kCGColorSpaceModelUnknown = -1;
kCGColorSpaceModelMonochrome = 0;
kCGColorSpaceModelRGB = 1;
kCGColorSpaceModelCMYK = 2;
kCGColorSpaceModelLab = 3;
kCGColorSpaceModelDeviceN = 4;
kCGColorSpaceModelIndexed = 5;
kCGColorSpaceModelPattern = 6;
kCGColorSpaceGenericGray = "CGColorSpaceGenericGray";
kCGColorSpaceGenericRGB = "CGColorSpaceGenericRGB";
kCGColorSpaceGenericCMYK = "CGColorSpaceGenericCMYK";
kCGColorSpaceGenericRGBLinear = "CGColorSpaceGenericRGBLinear";
kCGColorSpaceGenericRGBHDR = "CGColorSpaceGenericRGBHDR";
kCGColorSpaceAdobeRGB1998 = "CGColorSpaceAdobeRGB1998";
kCGColorSpaceSRGB = "CGColorSpaceSRGB";
var _CGNamedColorSpaces = {};
function CGColorSpaceCreateCalibratedGray(aWhitePoint, aBlackPoint, gamma)
{
    return { model:kCGColorSpaceModelMonochrome, count:1, base:null };
}
function CGColorSpaceCreateCalibratedRGB(aWhitePoint, aBlackPoint, gamma)
{
    return { model:kCGColorSpaceModelRGB, count:1, base:null };
}
function CGColorSpaceCreateICCBased(aComponentCount, range, profile, alternate)
{
    return null;
}
function CGColorSpaceCreateLab(aWhitePoint, aBlackPoint, aRange)
{
    return null;
}
function CGColorSpaceCreateDeviceCMYK()
{
    return CGColorSpaceCreateWithName(kCGColorSpaceGenericCMYK);
}
function CGColorSpaceCreateDeviceGray()
{
    return CGColorSpaceCreateWithName(kCGColorSpaceGenericGray);
}
function CGColorSpaceCreateDeviceRGB()
{
    return CGColorSpaceCreateWithName(kCGColorSpaceGenericRGB);
}
function CGColorSpaceCreateWithPlatformColorSpace()
{
    return null;
}
function CGColorSpaceCreateIndexed(aBaseColorSpace, lastIndex, colorTable)
{
    return null;
}
function CGColorSpaceCreatePattern(aBaseColorSpace)
{
    if (aBaseColorSpace)
        return { model:kCGColorSpaceModelPattern, count:aBaseColorSpace.count, base:aBaseColorSpace };
    return { model:kCGColorSpaceModelPattern, count:0, base:null };
}
function CGColorSpaceCreateWithName(aName)
{
    if(!(aName in _CGNamedColorSpaces)) {
	    switch (aName)
	    {
	        case kCGColorSpaceGenericGray: _CGNamedColorSpaces[aName] = { model:kCGColorSpaceModelMonochrome, count:1, base:null };
	        case kCGColorSpaceGenericRGB: _CGNamedColorSpaces[aName] = { model:kCGColorSpaceModelRGB, count:3, base:null };
	        case kCGColorSpaceGenericCMYK: _CGNamedColorSpaces[aName] = { model:kCGColorSpaceModelCMYK, count:4, base:null };
	        case kCGColorSpaceGenericRGBLinear: _CGNamedColorSpaces[aName] = { model:kCGColorSpaceModelRGB, count:3, base:null };
	        case kCGColorSpaceGenericRGBHDR: _CGNamedColorSpaces[aName] = { model:kCGColorSpaceModelRGB, count:3, base:null };
	        case kCGColorSpaceAdobeRGB1998: _CGNamedColorSpaces[aName] = { model:kCGColorSpaceModelRGB, count:3, base:null };
	        case kCGColorSpaceSRGB: _CGNamedColorSpaces[aName] = { model:kCGColorSpaceModelRGB, count:3, base:null };
	    }
    }
    return _CGNamedColorSpaces[aName];
/*
    if (colorSpace)
        return colorSpace;
    
    return null;
*/
}
function CGColorSpaceCopyICCProfile(aColorSpace)
{
    return null;
}
function CGColorSpaceGetNumberOfComponents(aColorSpace)
{
    return aColorSpace.count;
}
function CGColorSpaceGetTypeID(aColorSpace)
{
}
function CGColorSpaceGetModel(aColorSpace)
{
    return aColorSpace.model;
}
function CGColorSpaceGetBaseColorSpace(aColorSpace)
{
}
function CGColorSpaceGetColorTableCount(aColorSpace)
{
}
function CGColorSpaceGetColorTable(aColorSpace)
{
}
function CGColorSpaceRelease(aColorSpace)
{
}
function CGColorSpaceRetain(aColorSpace)
{
    return aColorSpace;
}
function CGColorSpaceStandardizeComponents(aColorSpace, components)
{
    var count = aColorSpace.count;
    { if (count > components.length) { components[count] = 1; return; } var component = components[count]; if (component < 0) components[count] = 0; else if (component > 1) components[count] = 1; else components[count] = ROUND(component * 1000) / 1000; };
    if (aColorSpace.base)
        aColorSpace = aColorSpace.base;
    switch (aColorSpace.model)
    {
        case kCGColorSpaceModelMonochrome:
        case kCGColorSpaceModelRGB:
        case kCGColorSpaceModelCMYK:
        case kCGColorSpaceModelDeviceN: while (count--)
                                                { if (count > components.length) { components[count] = 1; return; } var component = components[count]; if (component < 0) components[count] = 0; else if (component > 1) components[count] = 1; else components[count] = ROUND(component * 255) / 255; };
                                            break;
        case kCGColorSpaceModelIndexed:
        case kCGColorSpaceModelLab:
        case kCGColorSpaceModelPattern: break;
    }
}

// CGColor.js

var CFTypeGlobalCount = 0;
function CFHashCode(aCFObject)
{
    if (!aCFObject.hash)
        aCFObject.hash = ++CFTypeGlobalCount;
    return aCFObject;
}
kCGColorWhite = "kCGColorWhite";
kCGColorBlack = "kCGColorBlack";
kCGColorClear = "kCGColorClear";
var _CGColorMap = { };
function CGColorGetConstantColor(aColorName)
{
    alert("FIX ME");
}
function CGColorRetain(aColor)
{
    return aColor;
}
function CGColorRelease()
{
}
function CGColorCreate(aColorSpace, components)
{
    if (!aColorSpace || !components)
        return null;
    var components = components.slice();
    CGColorSpaceStandardizeComponents(aColorSpace, components);
    var UID = CFHashCode(aColorSpace) + components.join("");
    if (_CGColorMap[UID])
        return _CGColorMap[UID];
    return _CGColorMap[UID] = { colorspace:aColorSpace, pattern:null, components:components };
}
function CGColorCreateCopy(aColor)
{
    return aColor;
}
function CGColorCreateGenericGray(gray, alpha)
{
    return CGColorCreate(CGColorSpaceCreateDeviceRGB(), [gray, gray, gray, alpha]);
}
function CGColorCreateGenericRGB(red, green, blue, alpha)
{
    return CGColorCreate(CGColorSpaceCreateDeviceRGB(), [red, green, blue, alpha]);
}
function CGColorCreateGenericCMYK(cyan, magenta, yellow, black, alpha)
{
    return CGColorCreate(CGColorSpaceCreateDeviceCMYK(),
                         [cyan, magenta, yellow, black, alpha]);
}
function CGColorCreateCopyWithAlpha(aColor, anAlpha)
{
    if (!aColor)
        return aColor;
    var components = aColor.components.slice();
    if (anAlpha == components[components.length - 1])
        return aColor;
    components[components.length - 1] = anAlpha;
    if (aColor.pattern)
        return CGColorCreateWithPattern(aColor.colorspace, aColor.pattern, components);
    else
        return CGColorCreate(aColor.colorspace, components);
}
function CGColorCreateWithPattern(aColorSpace, aPattern, components)
{
    if (!aColorSpace || !aPattern || !components)
        return null;
    return { colorspace:aColorSpace, pattern:aPattern, components:components.slice() };
}
function CGColorEqualToColor(lhs, rhs)
{
    if (lhs == rhs)
        return true;
    if (!lhs || !rhs)
        return false;
    var lhsComponents = lhs.components,
        rhsComponents = rhs.components,
        lhsComponentCount = lhsComponents.length;
    if (lhsComponentCount != rhsComponents.length)
        return false;
    while (lhsComponentCount--)
        if (lhsComponents[lhsComponentCount] != rhsComponents[lhsComponentCount])
            return false;
    if (lhs.pattern != rhs.pattern)
        return false;
    if (CGColorSpaceEqualToColorSpace(lhs.colorspace, rhs.colorspace))
        return false;
    return true;
}
function CGColorGetAlpha(aColor)
{
    var components = aColor.components;
    return components[components.length - 1];
}
function CGColorGetColorSpace(aColor)
{
    return aColor.colorspace;
}
function CGColorGetComponents(aColor)
{
    return aColor.components;
}
function CGColorGetNumberOfComponents(aColor)
{
    return aColor.components.length;
}
function CGColorGetPattern(aColor)
{
    return aColor.pattern;
}

// CGPath.js

kCGPathElementMoveToPoint = 0;
kCGPathElementAddLineToPoint = 1;
kCGPathElementAddQuadCurveToPoint = 2;
kCGPathElementAddCurveToPoint = 3;
kCGPathElementCloseSubpath = 4;
kCGPathElementAddArc = 5;
kCGPathElementAddArcToPoint = 6;
function CGPathCreateMutable()
{
    return { count:0, start:null, current:null, elements:[] };
}
function CGPathCreateMutableCopy(aPath)
{
    var path = CGPathCreateMutable();
    CGPathAddPath(path, aPath);
    return path;
}
function CGPathCreateCopy(aPath)
{
    return CGPathCreateMutableCopy(aPath);
}
function CGPathRelease(aPath)
{
}
function CGPathRetain(aPath)
{
    return aPath;
}
function CGPathAddArc(aPath, aTransform, x, y, aRadius, aStartAngle, anEndAngle, isClockwise)
{
    if (aTransform && !CGAffineTransformIsIdentity(aTransform))
    {
        var center = CGPointMake(x, y),
            end = CGPointMake(COS(anEndAngle), SIN(anEndAngle)),
            start = CGPointMake(COS(aStartAngle), SIN(aStartAngle));
        end = CGPointApplyAffineTransform(end, aTransform);
        start = CGPointApplyAffineTransform(start, aTransform);
        center = CGPointApplyAffineTransform(center, aTransform);
        x = center.x;
        y = center.y;
        var oldEndAngle = anEndAngle,
            oldStartAngle = aStartAngle;
        anEndAngle = ATAN2(end.y - aTransform.ty, end.x - aTransform.tx);
        aStartAngle = ATAN2(start.y - aTransform.ty, start.x - aTransform.tx);
        if (anEndAngle == aStartAngle && oldEndAngle != oldStartAngle)
            if (oldStartAngle > oldEndAngle)
                anEndAngle = anEndAngle - PI2;
            else
                aStartAngle = aStartAngle - PI2;
        aRadius = CGSizeMake(aRadius, 0);
        aRadius = CGSizeApplyAffineTransform(aRadius, aTransform);
        aRadius = SQRT(aRadius.width * aRadius.width + aRadius.height * aRadius.height);
    }
    aPath.current = CGPointMake(x + aRadius * COS(anEndAngle), y + aRadius * SIN(anEndAngle));
    aPath.elements[aPath.count++] = { type:kCGPathElementAddArc, x:x, y:y, radius:aRadius, startAngle:aStartAngle, endAngle:anEndAngle };
}
function CGPathAddArcToPoint(aPath, aTransform, x1, y1, x2, y2, aRadius)
{
}
function CGPathAddCurveToPoint(aPath, aTransform, cp1x, cp1y, cp2x, cp2y, x, y)
{
    var cp1 = CGPointMake(cp1x, cp1y),
        cp2 = CGPointMake(cp2x, cp2y),
        end = CGPointMake(x, y);
    if (aTransform)
    {
        cp1 = CGPointApplyAffineTransform(cp1, aTransform);
        cp2 = CGPointApplyAffineTransform(cp2, aTransform);
        end = CGPointApplyAffineTransform(end, aTransform);
    }
   aPath.current = end;
   aPath.elements[aPath.count++] = { type:kCGPathElementAddCurveToPoint, cp1x:cp1.x, cp1y:cp1.y, cp2x:cp2.x, cp2y:cp2.y, x:end.x, y:end.y };
}
function CGPathAddLines(aPath, aTransform, points, count)
{
    var i = 1;
    if (count === null)
        var count = points.length;
    if (!aPath || count < 2)
        return;
    CGPathMoveToPoint(aPath, aTransform, points[0].x, points[0].y);
    for (; i < count; ++i)
        CGPathAddLineToPoint(aPath, aTransform, points[i].x, points[i].y);
}
function CGPathAddLineToPoint(aPath, aTransform, x, y)
{
    var point = CGPointMake(x, y);
    if (aTransform != null)
        point = CGPointApplyAffineTransform(point, aTransform);
    aPath.elements[aPath.count++] = { type: kCGPathElementAddLineToPoint, x:point.x, y:point.y };
    aPath.current = point;
}
function CGPathAddPath(aPath, aTransform, anotherPath)
{
    for (var i = 0, count = anotherPath.count; i < count; ++i)
    {
        var element = anotherPath.elements[i];
        switch (element.type)
        {
            case kCGPathElementAddLineToPoint: CGPathAddLineToPoint(aPath, aTransform, element.x, element.y);
                                                    break;
            case kCGPathElementAddCurveToPoint: CGPathAddCurveToPoint(aPath, aTransform,
                                                                          element.cp1x, element.cp1y,
                                                                          element.cp2x, element.cp2y,
                                                                          element.x, element.y);
                                                    break;
            case kCGPathElementAddArc: CGPathAddArc(aPath, aTransform, element.x, element.y,
                                                                 element.radius, element.startAngle,
                                                                 element.endAngle, element.isClockwise);
                                                    break;
            case kCGPathElementAddQuadCurveToPoint: CGPathAddQuadCurveToPoint(aPath, aTransform,
                                                                              element.cpx, element.cpy,
                                                                              element.x, element.y);
                                                    break;
            case kCGPathElementMoveToPoint: CGPathMoveToPoint(aPath, aTransform, element.x, element.y);
                                                    break;
            case kCGPathElementCloseSubpath: CGPathCloseSubpath(aPath);
                                                    break;
        }
    }
}
function CGPathAddQuadCurveToPoint(aPath, aTransform, cpx, cpy, x, y)
{
    var cp = CGPointMake(cpx, cpy),
        end = CGPointMake(x, y);
    if (aTransform)
    {
        cp = CGPointApplyAffineTransform(cp, aTransform);
        end = CGPointApplyAffineTransform(end, aTransform);
    }
    aPath.elements[aPath.count++] = { type:kCGPathElementAddQuadCurveToPoint, cpx:cp.x, cpy:cp.y, x:end.x, y:end.y }
    aPath.current = end;
}
function CGPathAddRect(aPath, aTransform, aRect)
{
    CGPathAddRects(aPath, aTransform, [aRect], 1);
}
function CGPathAddRects(aPath, aTransform, rects, count)
{
    var i = 0;
    if (count === null)
        var count = rects.length;
    for (; i < count; ++i)
    {
        var rect = rects[i];
        CGPathMoveToPoint(aPath, aTransform, CGRectGetMinX(rect), CGRectGetMinY(rect));
        CGPathAddLineToPoint(aPath, aTransform, CGRectGetMaxX(rect), CGRectGetMinY(rect));
        CGPathAddLineToPoint(aPath, aTransform, CGRectGetMaxX(rect), CGRectGetMaxY(rect));
        CGPathAddLineToPoint(aPath, aTransform, CGRectGetMinX(rect), CGRectGetMaxY(rect));
        CGPathCloseSubpath(aPath);
    }
}
function CGPathMoveToPoint(aPath, aTransform, x, y)
{
    var point = CGPointMake(x, y),
        count = aPath.count;
    if (aTransform != null)
        point = CGPointApplyAffineTransform(point, aTransform);
    aPath.start = point;
    aPath.current = point;
    var previous = aPath.elements[count - 1];
    if (count != 0 && previous.type == kCGPathElementMoveToPoint)
    {
        previous.x = point.x;
        previous.y = point.y;
    }
    else
        aPath.elements[aPath.count++] = { type:kCGPathElementMoveToPoint, x:point.x, y:point.y };
}
var KAPPA = 4.0 * ((SQRT2 - 1.0) / 3.0);
function CGPathWithEllipseInRect(aRect)
{
    var path = CGPathCreateMutable();
    if (CGRectGetWidth(aRect) == CGRectGetHeight(aRect))
        CGPathAddArc(path, nil, CGRectGetMidX(aRect), CGRectGetMidY(aRect), CGRectGetWidth(aRect) / 2.0, 0.0, 2 * PI, YES);
    else
    {
        var axis = CGSizeMake(CGRectGetWidth(aRect) / 2.0, CGRectGetHeight(aRect) / 2.0),
            center = CGPointMake(CGRectGetMinX(aRect) + axis.width, CGRectGetMinY(aRect) + axis.height);
        CGPathMoveToPoint(path, nil, center.x, center.y - axis.height);
        CGPathAddCurveToPoint(path, nil, center.x + (KAPPA * axis.width), center.y - axis.height, center.x + axis.width, center.y - (KAPPA * axis.height), center.x + axis.width, center.y);
        CGPathAddCurveToPoint(path, nil, center.x + axis.width, center.y + (KAPPA * axis.height), center.x + (KAPPA * axis.width), center.y + axis.height, center.x, center.y + axis.height);
        CGPathAddCurveToPoint(path, nil, center.x - (KAPPA * axis.width), center.y + axis.height, center.x - axis.width, center.y + (KAPPA * axis.height), center.x - axis.width, center.y);
        CGPathAddCurveToPoint(path, nil, center.x - axis.width, center.y - (KAPPA * axis.height), center.x - (KAPPA * axis.width), center.y - axis.height, center.x, center.y - axis.height);
    }
    CGPathCloseSubpath(path);
    return path;
}
function CGPathWithRoundedRectangleInRect(aRect, xRadius, yRadius , ne, se, sw, nw)
{
    var path = CGPathCreateMutable(),
        xMin = CGRectGetMinX(aRect),
        xMax = CGRectGetMaxX(aRect),
        yMin = CGRectGetMinY(aRect),
        yMax = CGRectGetMaxY(aRect);
    CGPathMoveToPoint(path, nil, xMin + xRadius, yMin);
    if (ne)
    {
        CGPathAddLineToPoint(path, nil, xMax - xRadius, yMin);
        CGPathAddCurveToPoint(path, nil, xMax - xRadius, yMin, xMax, yMin, xMax, yMin + xRadius);
    }
    else
        CGPathAddLineToPoint(path, nil, xMax, yMin);
    if (se)
    {
        CGPathAddLineToPoint(path, nil, xMax, yMax - xRadius);
        CGPathAddCurveToPoint(path, nil, xMax, yMax - xRadius, xMax, yMax, xMax - xRadius, yMax);
    }
    else
        CGPathAddLineToPoint(path, nil, xMax, yMax);
    if (sw)
    {
        CGPathAddLineToPoint(path, nil, xMin + xRadius, yMax);
        CGPathAddCurveToPoint(path, nil, xMin + xRadius, yMax, xMin, yMax, xMin, yMax - xRadius);
    }
    else
        CGPathAddLineToPoint(path, nil, xMin, yMax);
    if (nw)
    {
        CGPathAddLineToPoint(path, nil, xMin, yMin + xRadius);
        CGPathAddCurveToPoint(path, nil, xMin, yMin + xRadius, xMin, yMin, xMin + xRadius, yMin);
    }
    else
        CGPathAddLineToPoint(path, nil, xMin, yMin);
    CGPathCloseSubpath(path);
    return path;
}
function CGPathCloseSubpath(aPath)
{
    var count = aPath.count;
    if (count == 0 || aPath.elements[count - 1].type == kCGPathElementCloseSubpath)
        return;
    aPath.elements[aPath.count++] = { type:kCGPathElementCloseSubpath, points:[aPath.start] };
}
function CGPathEqualToPath(aPath, anotherPath)
{
    if (aPath == anotherPath)
        return YES;
    if (aPath.count != anotherPath.count || !CGPointEqualToPoint(aPath.start, anotherPath.start) || !CGPointEqualToPoint(aPath.current, anotherPath.current))
        return NO;
    var i = 0,
        count = aPath.count;
    for (; i < count; ++i)
    {
        var element = aPath[i],
            anotherElement = anotherPath[i];
        if (element.type != anotherElement.type)
            return NO;
        if ((element.type == kCGPathElementAddArc || element.type == kCGPathElementAddArcToPoint) &&
            element.radius != anotherElement.radius)
            return NO;
        var j = element.points.length;
        while (j--)
            if (!CGPointEqualToPoint(element.points[j], anotherElement.points[j]))
                return NO;
    }
    return YES;
}
function CGPathGetCurrentPoint(aPath)
{
    return CGPointCreateCopy(aPath.current);
}
function CGPathIsEmpty(aPath)
{
    return !aPath || aPath.count == 0;
}

// CGContext.js

kCGLineCapButt = 0;
kCGLineCapRound = 1;
kCGLineCapSquare = 2;
kCGLineJoinMiter = 0;
kCGLineJoinRound = 1;
kCGLineJoinBevel = 2;
kCGPathFill = 0;
kCGPathEOFill = 1;
kCGPathStroke = 2;
kCGPathFillStroke = 3;
kCGPathEOFillStroke = 4;
kCGBlendModeNormal = 0;
kCGBlendModeMultiply = 1;
kCGBlendModeScreen = 2;
kCGBlendModeOverlay = 3;
kCGBlendModeDarken = 4;
kCGBlendModeLighten = 5;
kCGBlendModeColorDodge = 6;
kCGBlendModeColorBurn = 7;
kCGBlendModeSoftLight = 8;
kCGBlendModeHardLight = 9;
kCGBlendModeDifference = 10;
kCGBlendModeExclusion = 11;
kCGBlendModeHue = 12;
kCGBlendModeSaturation = 13;
kCGBlendModeColor = 14;
kCGBlendModeLuminosity = 15;
kCGBlendModeClear = 16;
kCGBlendModeCopy = 17;
kCGBlendModeSourceIn = 18;
kCGBlendModeSourceOut = 19;
kCGBlendModeSourceAtop = 20;
kCGBlendModeDestinationOver = 21;
kCGBlendModeDestinationIn = 22;
kCGBlendModeDestinationOut = 23;
kCGBlendModeDestinationAtop = 24;
kCGBlendModeXOR = 25;
kCGBlendModePlusDarker = 26;
kCGBlendModePlusLighter = 27;
function CGContextRelease()
{
}
function CGContextRetain(aContext)
{
    return aContext;
}
if (!CPFeatureIsCompatible(CPHTMLCanvasFeature))
{
	function CGGStateCreate()
{
    return { alpha:1.0, strokeStyle:"#000", fillStyle:"#ccc", lineWidth:1.0, lineJoin:kCGLineJoinMiter, lineCap:kCGLineCapButt, miterLimit:10.0, globalAlpha:1.0,
        blendMode:kCGBlendModeNormal,
        shadowOffset:CGSizeMakeZero(), shadowBlur:0.0, shadowColor:null, CTM:CGAffineTransformMakeIdentity() };
}
function CGGStateCreateCopy(aGState)
{
    return { alpha:aGState.alpha, strokeStyle:aGState.strokeStyle, fillStyle:aGState.fillStyle, lineWidth:aGState.lineWidth,
        lineJoin:aGState.lineJoin, lineCap:aGState.lineCap, miterLimit:aGState.miterLimit, globalAlpha:aGState.globalAlpha,
        blendMode:aGState.blendMode,
        shadowOffset:CGSizeMakeCopy(aGState.shadowOffset), shadowBlur:aGState.shadowBlur, shadowColor:aGState.shadowColor, CTM:CGAffineTransformMakeCopy(aGState.CTM) };
}
function CGBitmapGraphicsContextCreate()
{
    return { DOMElement:document.createElement("div"), path:null, gState:CGGStateCreate(), gStateStack:[] };
}
function CGContextSaveGState(aContext)
{
    aContext.gStateStack.push(CGGStateCreateCopy(aContext.gState));
}
function CGContextRestoreGState(aContext)
{
    aContext.gState = aContext.gStateStack.pop();
}
function CGContextSetLineCap(aContext, aLineCap)
{
    aContext.gState.lineCap = aLineCap;
}
function CGContextSetLineJoin(aContext, aLineJoin)
{
    aContext.gState.lineJoin = aLineJoin;
}
function CGContextSetLineWidth(aContext, aLineWidth)
{
    aContext.gState.lineWidth = aLineWidth;
}
function CGContextSetMiterLimit(aContext, aMiterLimit)
{
    aContext.gState.miterLimit = aMiterLimit;
}
function CGContextSetBlendMode(aContext, aBlendMode)
{
    aContext.gState.blendMode = aBlendMode;
}
function CGContextAddArc(aContext, x, y, radius, startAngle, endAngle, clockwise)
{
    CGPathAddArc(aContext.path, aContext.gState.CTM, x, y, radius, startAngle, endAngle, clockwise);
}
function CGContextAddArcToPoint(aContext, x1, y1, x2, y2, radius)
{
    CGPathAddArcToPoint(aContext.path, aContext.gState.CTM, x1, y1, x2, y2, radius);
}
function CGContextAddCurveToPoint(aContext, cp1x, cp1y, cp2x, cp2y, x, y)
{
    CGPathAddCurveToPoint(aContext.path, aContext.gState.CTM, cp1x, cp1y, cp2x, cp2y, x, y);
}
function CGContextAddLines(aContext, points, count)
{
    CGPathAddLines(aContext.path, aContext.gState.CTM, points, count);
}
function CGContextAddLineToPoint(aContext, x, y)
{
    CGPathAddLineToPoint(aContext.path, aContext.gState.CTM, x, y);
}
function CGContextAddPath(aContext, aPath)
{
    if (!aContext || CGPathIsEmpty(aPath))
        return;
    if (!aContext.path)
        aContext.path = CGPathCreateMutable();
    CGPathAddPath(aContext.path, aContext.gState.CTM, aPath);
}
function CGContextAddQuadCurveToPoint(aContext, cpx, cpy, x, y)
{
    CGPathAddQuadCurveToPoint(aContext.path, aContext.gState.CTM, cpx, cpy, x, y);
}
function CGContextAddRect(aContext, aRect)
{
    CGPathAddRect(aContext.path, aContext.gState.CTM, aRect);
}
function CGContextAddRects(aContext, rects, count)
{
    CGPathAddRects(aContext.path, aContext.gState.CTM, rects, count);
}
function CGContextBeginPath(aContext)
{
    aContext.path = CGPathCreateMutable();
}
function CGContextClosePath(aContext)
{
    CGPathCloseSubpath(aContext.path);
}
function CGContextMoveToPoint(aContext, x, y)
{
    if (!aContext.path)
        aContext.path = CGPathCreateMutable();
    CGPathMoveToPoint(aContext.path, aContext.gState.CTM, x, y);
}
function CGContextFillRect(aContext, aRect)
{
    CGContextFillRects(aContext, [aRect], 1);
}
function CGContextFillRects(aContext, rects, count)
{
    if (arguments[2] === undefined)
        var count = rects.length;
    CGContextBeginPath(aContext);
    CGContextAddRects(aContext, rects, count);
    CGContextClosePath(aContext);
    CGContextDrawPath(aContext, kCGPathFill);
}
function CGContextStrokeRect(aContext, aRect)
{
    CGContextBeginPath(aContext);
    CGContextAddRect(aContext, aRect);
    CGContextClosePath(aContext);
    CGContextDrawPath(aContext, kCGPathStroke);
}
function CGContextStrokeRectWithWidth(aContext, aRect, aWidth)
{
    CGContextSaveGState(aContext);
    CGContextSetLineWidth(aContext, aWidth);
    CGContextStrokeRect(aContext, aRect);
    CGContextRestoreGState(aContext);
}
function CGContextConcatCTM(aContext, aTransform)
{
    var CTM = aContext.gState.CTM;
    CGAffineTransformConcatTo(CTM, aTransform, CTM);
}
function CGContextGetCTM(aContext)
{
    return aContext.gState.CTM;
}
function CGContextRotateCTM(aContext, anAngle)
{
    var gState = aContext.gState;
    gState.CTM = CGAffineTransformRotate(gState.CTM, anAngle);
}
function CGContextScaleCTM(aContext, sx, sy)
{
    var gState = aContext.gState;
    gState.CTM = CGAffineTransformScale(gState.CTM, sx, sy);
}
function CGContextTranslateCTM(aContext, tx, ty)
{
    var gState = aContext.gState;
    gState.CTM = CGAffineTransformTranslate(gState.CTM, tx, ty);
}
function CGContextSetShadow(aContext, aSize, aBlur)
{
    var gState = aContext.gState;
    gState.shadowOffset = CGSizeMakeCopy(aSize);
    gState.shadowBlur = aBlur;
    gState.shadowColor = CGColorCreateGenericGray(0.0, 1.0 / 3.0);
}
function CGContextSetShadowWithColor(aContext, aSize, aBlur, aColor)
{
    var gState = aContext.gState;
    gState.shadowOffset = CGSizeMakeCopy(aSize);
    gState.shadowBlur = aBlur;
    gState.shadowColor = aColor;
}
function CGContextSetAlpha(aContext, anAlpha)
{
    aContext.gState.alpha = MAX(MIN(anAlpha, 1.0), 0.0);
}
}
function CGContextEOFillPath(aContext)
{
    CGContextDrawPath(aContext, kCGPathEOFill);
}
function CGContextFillPath(aContext)
{
    CGContextDrawPath(aContext, kCGPathFill);
    CGContextClosePath(aContext);
}
var KAPPA = 4.0 * ((SQRT2 - 1.0) / 3.0);
function CGContextAddEllipseInRect(aContext, aRect)
{
    CGContextBeginPath(aContext);
    CGContextAddPath(aContext, CGPathWithEllipseInRect(aRect));
    CGContextClosePath(aContext);
}
function CGContextFillEllipseInRect(aContext, aRect)
{
    CGContextBeginPath(aContext);
    CGContextAddEllipseInRect(aContext, aRect);
    CGContextClosePath(aContext);
    CGContextFillPath(aContext);
}
function CGContextStrokeEllipseInRect(aContext, aRect)
{
    CGContextBeginPath(aContext);
    CGContextAddEllipseInRect(aContext, aRect);
    CGContextClosePath(aContext);
    CGContextStrokePath(aContext);
}
function CGContextStrokePath(aContext)
{
    CGContextDrawPath(aContext, kCGPathStroke);
    CGContextClosePath(aContext);
}
function CGContextStrokeLineSegments(aContext, points, count)
{
    var i = 0;
    if (count === null)
        var count = points.length;
    CGContextBeginPath(aContext);
    for (; i < count; i += 2)
    {
        CGContextMoveToPoint(aContext, points[i].x, points[i].y);
        CGContextAddLineToPoint(aContext, points[i + 1].x, points[i + 1].y);
    }
    CGContextStrokePath(aContext);
}
function CGContextSetFillColor(aContext, aColor)
{
    if (aColor)
        aContext.gState.fillStyle = to_string(aColor);
}
function CGContextSetStrokeColor(aContext, aColor)
{
    if (aColor)
        aContext.gState.strokeStyle = to_string(aColor);
}
function CGContextFillRoundedRectangleInRect(aContext, aRect, aRadius, ne, se, sw, nw)
{
    CGContextBeginPath(aContext);
    CGContextAddPath(aContext, CGPathWithRoundedRectangleInRect(aRect, aRadius, aRadius, ne, se, sw, nw));
    CGContextClosePath(aContext);
    CGContextFillPath(aContext);
}
function CGContextStrokeRoundedRectangleInRect(aContext, aRect, aRadius, ne, se, sw, nw)
{
    CGContextBeginPath(aContext);
    CGContextAddPath(aContext, CGPathWithRoundedRectangleInRect(aRect, aRadius, aRadius, ne, se, sw, nw));
    CGContextClosePath(aContext);
    CGContextStrokePath(aContext);
}

var CANVAS_LINECAP_TABLE = [ "butt", "round", "square" ],
    CANVAS_LINEJOIN_TABLE = [ "miter", "round", "bevel" ],
    CANVAS_COMPOSITE_TABLE = [ "source-over", "source-over", "source-over", "source-over", "darker",
                                "lighter", "source-over", "source-over", "source-over", "source-over",
                                "source-over", "source-over", "source-over", "source-over", "source-over",
                                "source-over", "source-over",
                                "copy", "source-in", "source-out", "source-atop",
                                "destination-over", "destination-in", "destination-out", "destination-atop",
                                "xor", "source-over", "source-over" ];
function CGContextSaveGState(aContext)
{
    aContext.save();
}
function CGContextRestoreGState(aContext)
{
    aContext.restore();
}
function CGContextSetLineCap(aContext, aLineCap)
{
    aContext.lineCap = CANVAS_LINECAP_TABLE[aLineCap];
}
function CGContextSetLineJoin(aContext, aLineJoin)
{
    aContext.lineJoin = CANVAS_LINEJOIN_TABLE[aLineJoin];
}
function CGContextSetLineWidth(aContext, aLineWidth)
{
    aContext.lineWidth = aLineWidth;
}
function CGContextSetMiterLimit(aContext, aMiterLimit)
{
    aContext.miterLimit = aMiterLimit;
}
function CGContextSetBlendMode(aContext, aBlendMode)
{
    aContext.globalCompositeOperation = CANVAS_COMPOSITE_TABLE[aBlendMode];
}
function CGContextAddArc(aContext, x, y, radius, startAngle, endAngle, clockwise)
{
    aContext.arc(x, y, radius, startAngle, endAngle, !clockwise);
}
function CGContextAddArcToPoint(aContext, x1, y1, x2, y2, radius)
{
    aContext.arcTo(x1, y1, x2, y2, radius);
}
function CGContextAddCurveToPoint(aContext, cp1x, cp1y, cp2x, cp2y, x, y)
{
    aContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
}
function CGContextAddLineToPoint(aContext, x, y)
{
    aContext.lineTo(x, y);
}
function CGContextAddPath(aContext, aPath)
{
    if (!aContext || CGPathIsEmpty(aPath))
        return;
    var elements = aPath.elements,
        i = 0,
        count = aPath.count;
    for (; i < count; ++i)
    {
        var element = elements[i],
            type = element.type;
        switch (type)
        {
            case kCGPathElementMoveToPoint: aContext.moveTo(element.x, element.y);
                                                    break;
            case kCGPathElementAddLineToPoint: aContext.lineTo(element.x, element.y);
                                                    break;
            case kCGPathElementAddQuadCurveToPoint: aContext.quadraticCurveTo(element.cpx, element.cpy, element.x, element.y);
                                                    break;
            case kCGPathElementAddCurveToPoint: aContext.bezierCurveTo(element.cp1x, element.cp1y, element.cp2x, element.cp2y, element.x, element.y);
                                                    break;
            case kCGPathElementCloseSubpath: aContext.closePath();
                                                    break;
            case kCGPathElementAddArc: aContext.arc(element.x, element.y, element.radius, element.startAngle, element.endAngle, element.clockwise);
                                                    break;
            case kCGPathElementAddArcTo:
                                                    break;
        }
    }
}
function CGContextAddRect(aContext, aRect)
{
    aContext.rect(CGRectGetMinX(aRect), CGRectGetMinY(aRect), CGRectGetWidth(aRect), CGRectGetHeight(aRect));
}
function CGContextAddRects(aContext, rects, count)
{
    var i = 0;
    if (count === null)
        var count = rects.length;
    for (; i < count; ++i)
    {
        var rect = rects[i];
        aContext.rect(CGRectGetMinX(rect), CGRectGetMinY(rect), CGRectGetWidth(rect), CGRectGetHeight(rect));
    }
}
function CGContextBeginPath(aContext)
{
    aContext.beginPath();
}
function CGContextClosePath(aContext)
{
    aContext.closePath();
}
function CGContextMoveToPoint(aContext, x, y)
{
    aContext.moveTo(x, y);
}
function CGContextClearRect(aContext, aRect)
{
    aContext.clearRect(CGRectGetMinX(aRect), CGRectGetMinY(aRect), CGRectGetWidth(aRect), CGRectGetHeight(aRect));
}
function CGContextDrawPath(aContext, aMode)
{
    if (aMode == kCGPathFill || aMode == kCGPathFillStroke)
        aContext.fill();
    else if (aMode == kCGPathEOFill || aMode == kCGPathEOFillStroke)
        alert("not implemented!!!");
    if (aMode == kCGPathStroke || aMode == kCGPathFillStroke || aMode == kCGPathEOFillStroke)
        aContext.stroke();
}
function CGContextFillRect(aContext, aRect)
{
    aContext.fillRect(CGRectGetMinX(aRect), CGRectGetMinY(aRect), CGRectGetWidth(aRect), CGRectGetHeight(aRect));
}
function CGContextFillRects(aContext, rects, count)
{
    var i = 0;
    if (count === null)
        var count = rects.length;
    for (; i < count; ++i)
    {
        var rect = rects[i];
        aContext.fillRect(CGRectGetMinX(rect), CGRectGetMinY(rect), CGRectGetWidth(rect), CGRectGetHeight(rect));
    }
}
function CGContextStrokeRect(aContext, aRect)
{
    aContext.strokeRect(CGRectGetMinX(aRect), CGRectGetMinY(aRect), CGRectGetWidth(aRect), CGRectGetHeight(aRect));
}
function CGContextClip(aContext)
{
    aContext.clip();
}
function CGContextClipToRect(aContext, aRect)
{
    aContext.beginPath();
    aContext.rect(CGRectGetMinX(aRect), CGRectGetMinY(aRect), CGRectGetWidth(aRect), CGRectGetHeight(aRect));
    aContext.closePath();
    aContext.clip();
}
function CGContextClipToRects(aContext, rects, count)
{
    if (count === null)
        var count = rects.length;
    aContext.beginPath();
    CGContextAddRects(aContext, rects, count);
    aContext.clip();
}
function CGContextSetAlpha(aContext, anAlpha)
{
    aContext.globalAlpha = anAlpha;
}
function CGContextSetFillColor(aContext, aColor)
{
/*
    if ([aColor patternImage])
    {
        var patternImg = [aColor patternImage],
            size = [patternImg size],
            img;
        if (size)
            img = new Image(size.width, size.height);
        else
            img = new Image();
        img.src = [patternImg filename];
        var pattern = aContext.createPattern(img, "repeat");
        aContext.fillStyle = pattern;
    }
    else
*/
        aContext.fillStyle = to_string(aColor);
}
function CGContextSetStrokeColor(aContext, aColor)
{
    aContext.strokeStyle = to_string(aColor);
}
function CGContextSetShadow(aContext, aSize, aBlur)
{
    aContext.shadowOffsetX = aSize.width;
    aContext.shadowOffsetY = aSize.height;
    aContext.shadowBlur = aBlur;
}
function CGContextSetShadowWithColor(aContext, aSize, aBlur, aColor)
{
    aContext.shadowOffsetX = aSize.width;
    aContext.shadowOffsetY = aSize.height;
    aContext.shadowBlur = aBlur;
    aContext.shadowColor = to_string(aColor);
}
function CGContextRotateCTM(aContext, anAngle)
{
    aContext.rotate(anAngle);
}
function CGContextScaleCTM(aContext, sx, sy)
{
    aContext.scale(sx, sy);
}
function CGContextTranslateCTM(aContext, tx, ty)
{
    aContext.translate(tx, ty);
}
function eigen(anAffineTransform)
{
    alert("IMPLEMENT ME!");
}
if (CPFeatureIsCompatible(CPJavaScriptCanvasTransformFeature))
{
CGContextConcatCTM = function(aContext, anAffineTransform)
{
    aContext.transform(anAffineTransform.a, anAffineTransform.b, anAffineTransform.c, anAffineTransform.d, anAffineTransform.tx, anAffineTransform.ty);
};
}
else
{
CGContextConcatCTM = function(aContext, anAffineTransform)
{
    var a = anAffineTransform.a,
        b = anAffineTransform.b,
        c = anAffineTransform.c,
        d = anAffineTransform.d,
        tx = anAffineTransform.tx,
        ty = anAffineTransform.ty,
        sx = 1.0,
        sy = 1.0,
        a1 = 0.0,
        a2 = 0.0;
    if (b == 0.0 && c == 0.0)
    {
        sx = a;
        sy = d;
    }
    else if (a * b == -c * d)
    {
        var sign = (a * d < 0.0 || b * c > 0.0) ? -1.0 : 1.0, a2 = (ATAN2(b, d) + ATAN2(-sign * c, sign * a)) / 2.0, cos = COS(a2), sin = SIN(a2); if (cos == 0) { sx = -c / sin; sy = b / sin; } else if (sin == 0) { sx = a / cos; sy = d / cos; } else { abs_cos = ABS(cos); abs_sin = ABS(sin); sx = (abs_cos * a / cos + abs_sin * -c / sin) / (abs_cos + abs_sin); sy = (abs_cos * d / cos + abs_sin * b / sin) / (abs_cos + abs_sin); }
    }
    else if (a * c == -b * d)
    {
        var sign = (a * d < 0.0 || b * c > 0.0) ? -1.0 : 1.0; a1 = (ATAN2(sign * b, sign * a) + ATAN2(-c, d)) / 2.0, cos = COS(a1), sin = SIN(a1); if (cos == 0) { sx = b / sin; sy = -c / sin; } else if (sin == 0) { sx = a / cos; sy = d / cos; } else { abs_cos = ABS(cos); abs_sin = ABS(sin); sx = (abs_cos * a / cos + abs_sin * b / sin) / (abs_cos + abs_sin); sy = (abs_cos * d / cos + abs_sin * -c / sin) / (abs_cos + abs_sin); }
    }
    else
    {
        var transpose = CGAffineTransformMake(a, c, b, d, 0.0, 0.0),
            u = eigen(CGAffineTransformConcat(anAffineTransform, transpose)),
            v = eigen(CGAffineTransformConcat(transpose, anAffineTransform)),
            U = CGAffineTransformMake(u.vector_1.x, u.vector_2.x, u.vector_1.y, u.vector_2.y, 0.0, 0.0),
            VT = CGAffineTransformMake(v.vector_1.x, v.vector_1.y, v.vector_2.x, v.vector_2.y, 0.0, 0.0),
            S = CGAffineTransformConcat(CGAffineTransformConcat(CGAffineTransformInvert(U), anAffineTransform), CGAffineTransformInvert(VT));
        a = VT.a;
        b = VT.b;
        c = VT.c;
        d = VT.d;
        var sign = (a * d < 0.0 || b * c > 0.0) ? -1.0 : 1.0, a2 = (ATAN2(b, d) + ATAN2(-sign * c, sign * a)) / 2.0, cos = COS(a2), sin = SIN(a2); if (cos == 0) { sx = -c / sin; sy = b / sin; } else if (sin == 0) { sx = a / cos; sy = d / cos; } else { abs_cos = ABS(cos); abs_sin = ABS(sin); sx = (abs_cos * a / cos + abs_sin * -c / sin) / (abs_cos + abs_sin); sy = (abs_cos * d / cos + abs_sin * b / sin) / (abs_cos + abs_sin); }
        S.a *= sx;
        S.d *= sy;
        a = U.a;
        b = U.b;
        c = U.c;
        d = U.d;
        var sign = (a * d < 0.0 || b * c > 0.0) ? -1.0 : 1.0; a1 = (ATAN2(sign * b, sign * a) + ATAN2(-c, d)) / 2.0, cos = COS(a1), sin = SIN(a1); if (cos == 0) { sx = b / sin; sy = -c / sin; } else if (sin == 0) { sx = a / cos; sy = d / cos; } else { abs_cos = ABS(cos); abs_sin = ABS(sin); sx = (abs_cos * a / cos + abs_sin * b / sin) / (abs_cos + abs_sin); sy = (abs_cos * d / cos + abs_sin * -c / sin) / (abs_cos + abs_sin); }
        sx = S.a * sx;
        sy = S.d * sy;
    }
    if (tx != 0 || ty != 0)
        CGContextTranslateCTM(aContext, tx, ty);
    if (a1 != 0.0)
        CGContextRotateCTM(aContext, a1);
    if (sx != 1.0 || sy != 1.0)
        CGContextScaleCTM(aContext, sx, sy);
    if (a2 != 0.0)
        CGContextRotateCTM(aContext, a2);
};
}
function CGContextDrawImage(aContext, aRect, anImage)
{
    aContext.drawImage(anImage._image, CGRectGetMinX(aRect), CGRectGetMinY(aRect), CGRectGetWidth(aRect), CGRectGetHeight(aRect));
}
function to_string(aColor)
{
    return "rgba(" + ROUND(aColor.components[0] * 255) + ", " + ROUND(aColor.components[1] * 255) + ", " + ROUND(255 * aColor.components[2]) + ", " + aColor.components[3] + ")";
}
function CGContextDrawLinearGradient(aContext, aGradient, aStartPoint, anEndPoint, options)
{
    var colors = aGradient.colors,
        count = colors.length,
        linearGradient = aContext.createLinearGradient(aStartPoint.x, aStartPoint.y, anEndPoint.x, anEndPoint.y);
    while (count--)
        linearGradient.addColorStop(aGradient.locations[count], to_string(colors[count]));
    aContext.fillStyle = linearGradient;
    aContext.fill();
}
function CGBitmapGraphicsContextCreate()
{
    var DOMElement = document.createElement("canvas"),
        context = DOMElement.getContext("2d");
    context.DOMElement = DOMElement;
    return context;
}


// GRANT'S ADDITIONS

function CGContextDrawTiledImage(c, rect, img) {
	if(arguments.length == 4) {
		sRect = rect;
		rect = img;
		img = arguments[3];
		
		// var canv = document.createElement("canvas");
		// canv.width = sRect.size.width;
		// canv.height = sRect.size.height;
		
		// context = canv.getContext("2d");
		// CGContextDrawImage(context, sRect, CGRectMake(0, 0, sRect.size.width, sRect.size.height), img);
		//CGContextDrawImage(c, sRect, CGRectMake(0, 0, sRect.size.width, sRect.size.height), img);
		
		//img = canv;
	}
	
	var size = CGSizeMake(img.width, img.height);
	
	if(typeof sRect == "undefined")
		sRect = CGRectMake(0, 0, size.width, size.height);
	
	totalWidth = 0;
	
	while(totalWidth < rect.size.width) {
		if((totalWidth + sRect.size.width) > rect.size.width) {
			newWidth = rect.size.width - totalWidth;
			
			oldWidth = sRect.size.width;
			sRect.size.width = newWidth;
			
			c.drawImage(img, sRect.origin.x, sRect.origin.y, sRect.size.width, sRect.size.height, rect.origin.x, rect.origin.y, rect.size.width, rect.size.height);
		} else {
			c.drawImage(img, sRect.origin.x, sRect.origin.y, sRect.size.width, sRect.size.height, rect.origin.x, rect.origin.y, sRect.size.width, rect.size.height);
			totalWidth += sRect.size.width;
			rect.origin.x += sRect.size.width;
		}
	}
		
		// totalHeight += sRect.size.height;
	// }
	
	// CGContextSaveGState(c);
	
	// patt = c.createPattern(img, "repeat");
	// CGContextSetFillColor(c, patt);
	
	// console.log(rect);
	// CGContextFillRect(c, rect);
	
	// CGContextRestoreGState(c);
}
