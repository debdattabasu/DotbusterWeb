

export class Global {
  public static CIRCLE_RADIUS = 24; 
  public static HUD_HEIGHT = 64;
  public static WIDTH = 1280; 
  public static HEIGHT = 720;
  
  public static rectOverlap(rect0: number[], rect1: number[]) : boolean {
    return rect0[0] < rect1[0] + rect1[2] && rect0[0] + rect0[2] > rect1[0] && rect0[1] < rect1[1] + rect1[3] && rect0[1] + rect0[3] > rect1[1];
  }
  
  public static lineOverlap(start0: number[], end0: number[], start1: number[], end1: number[]): boolean {
    var a1 = end0[1] - start0[1];
    var b1 = start0[0] - end0[0];
    var c1 = a1 * start0[0] + b1 * start0[1];

    var a2 = end1[1] - start1[1];
    var b2 = start1[0] - end1[0];
    var c2 = a2 * start1[0] + b2 * start1[1];

    var det = a1 * b2 - a2 * b1;

    if (Math.abs(det) < 0.001) 
      return false;

    var xIntersect = (b2 * c1 - b1 * c2) / det;
    var yIntersect = (a1 * c2 - a2 * c1) / det;
    var margin = 0.1 / 40;

    if (Math.min(start0[0], end0[0]) + margin < xIntersect && Math.min(start0[1], end0[1]) + margin < yIntersect
        && Math.min(start1[0], end1[0]) + margin < xIntersect && Math.min(start1[1], end1[1]) + margin < yIntersect
        && Math.max(start0[0], end0[0]) - margin > xIntersect && Math.max(start0[1], end0[1]) - margin > yIntersect
        && Math.max(start1[0], end1[0]) - margin > xIntersect && Math.max(start1[1], end1[1]) - margin > yIntersect)
    {
        return true;
    }

    return false;
  }
}