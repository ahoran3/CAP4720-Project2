// Jonathan Cools-Lartigue, Brandon Forster
// Matt Hansen, Alex Horan
// CAP 4720- Project 2
// 17 October 2013

function Adjustment()
{
    
    this.matrix = new Matrix4();
    
    this.getAdjustment = function()
        {
        
        return this.matrix;
        
        }
    
    this.adjustUp = function()
        {
        
        this.matrix.rotate(1, 1,0,0);
        
        }
    
    this.adjustDown = function()
        {
        
        this.matrix.rotate(-1, 1,0,0);
        
        }
    
    this.adjustLeft = function()
        {
        
        this.matrix.rotate(1, 0, 1, 0);
        
        }
    
    this.adjustRight = function()
        {
        
        this.matrix.rotate(-1, 0, 1, 0);
        
        }
    
    this.adjustZoomIn = function()
        {
        
        this.matrix.scale(0.95, 0.95, 0.95);
        
        }
    
    this.adjustZoomOut = function()
        {
        
        this.matrix.scale(1.05, 1.05, 1.05);
        
        }
    
}
