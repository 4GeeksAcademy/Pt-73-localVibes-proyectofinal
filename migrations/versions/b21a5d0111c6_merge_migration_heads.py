"""merge migration heads

Revision ID: b21a5d0111c6
Revises: 173acd6e17c8, c57fa91ad623
Create Date: 2026-09-08 01:17:32.993558

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b21a5d0111c6'
down_revision = ('173acd6e17c8', 'c57fa91ad623')
branch_labels = None
depends_on = None


def upgrade():
    pass


def downgrade():
    pass
